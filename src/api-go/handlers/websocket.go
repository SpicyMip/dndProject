package handlers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // En producción, limita esto al dominio del frontend
	},
}

// Hub gestiona todas las conexiones WebSocket
type Hub struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mu         sync.Mutex
}

var MainHub = &Hub{
	clients:    make(map[*websocket.Conn]bool),
	broadcast:  make(chan []byte),
	register:   make(chan *websocket.Conn),
	unregister: make(chan *websocket.Conn),
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Println("New WebSocket client connected")
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
			h.mu.Unlock()
			log.Println("WebSocket client disconnected")
		case message := <-h.broadcast:
			h.mu.Lock()
			for client := range h.clients {
				err := client.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

// WebSocketHandler maneja la actualización a WebSocket
func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	MainHub.register <- conn
	
	// Mantener conexión viva y manejar desconexiones
	defer func() {
		MainHub.unregister <- conn
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// BroadcastNoticeUpdate envía una señal a todos los clientes para refrescar las noticias
func BroadcastNoticeUpdate() {
	MainHub.broadcast <- []byte("notices_updated")
}

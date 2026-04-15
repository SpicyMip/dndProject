package handlers

import (
	"gorm.io/gorm"
)

// DB es la instancia global de la base de datos compartida por todos los sub-paquetes
var DB *gorm.DB

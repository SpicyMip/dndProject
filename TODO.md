# 📋 Pendientes y Hoja de Ruta - Codex Arcanum

Este documento detalla las configuraciones y tareas necesarias para completar la integración del sistema y asegurar su estabilidad.

---

## 🔐 1. Seguridad y Autenticación (Prioridad Alta)

- [ ] **Configurar Firebase Admin SDK (Backend)**: 
    - Descargar el archivo `serviceAccountKey.json` desde la consola de Firebase (Project Settings > Service Accounts).
    - Colocarlo en `src/api-go/serviceAccountKey.json`.
    - *Nota: Añadir este archivo al `.gitignore` para no subirlo por accidente.*
- [ ] **Inyectar Token en Frontend**: 
    - Actualizar `src/app/lib/api.ts` para capturar el ID Token del `authContext` de Firebase.
    - Incluir el header `Authorization: Bearer <TOKEN>` en todas las llamadas de `apiFetch`.
- [ ] **Narrow CORS**: 
    - En `src/api-go/routes/routes.go`, cambiar `Access-Control-Allow-Origin: "*"` por el dominio real de tu frontend en producción para evitar ataques.

---

## 🗄️ 2. Base de Datos y Persistencia

- [ ] **Dockerizar Database CLI**: 
    - Crear un `Dockerfile` multietapa en `src/database-cli`.
    - Añadir un servicio `migrations` en `docker-compose.yml` que corra `up` antes de que la API inicie.
- [ ] **Refactorizar el Seed**: 
    - Mover la lógica de `seedDatabase` de `main.go` a un archivo de migración SQL o añadir un comando `seed` en el nuevo CLI.
- [ ] **Validación de Datos**: 
    - Implementar validaciones en Go (usando `validator.v10`) para los modelos de `Creature` y `Deity` antes de guardarlos en Postgres.

---

## 🚀 3. Infraestructura y DevOps

- [ ] **Actualizar K8s Manifests**: 
    - Los archivos en `/k8s` deben ser actualizados para reflejar la separación del CLI de base de datos y la inclusión de secretos de Firebase.
- [ ] **Variables de Entorno**: 
    - Crear un archivo `.env.example` en la raíz con todas las variables necesarias (`DB_HOST`, `DB_USER`, `FIREBASE_PROJECT_ID`, etc.).
- [ ] **Logs y Observabilidad**: 
    - Implementar un logger estructurado (como `zap` o `zerolog`) en el backend para rastrear errores de base de datos o intentos de acceso fallidos.

---

## ✨ 4. Funcionalidades de Juego (Futuro)

- [ ] **Lanzador de Dados**: Componente interactivo en el frontend para lanzamientos 1d20, 1d12, etc.
- [ ] **Editor de Personajes**: Interfaz en `/admin` para que el DM pueda editar HP o Inventario de los jugadores en tiempo real.
- [ ] **Bestiario Dinámico**: Permitir que el DM suba imágenes de los monstruos (integración con Firebase Storage).

---

*Documento generado el 13 de abril de 2026.*

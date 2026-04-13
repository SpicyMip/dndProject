# 🛡️ Codex Arcanum - D&D Campaign Manager

Este proyecto es una plataforma integral para gestionar campañas de D&D, con un enfoque en la seguridad, el rendimiento y una experiencia de usuario arcanamente inmersiva.

---

## 🏗️ Arquitectura del Sistema

El proyecto está dividido en tres entidades principales completamente desacopladas:

1.  **Frontend (`/src/app`)**: 
    *   **Tecnología**: Next.js 16+, TypeScript, Tailwind CSS, Shadcn UI.
    *   **Autenticación**: Firebase Auth (Identity Platform).
    *   **Funciones**: Codex (Bestiario, Panteón), Gestión de Personajes, Inventario Compartido.

2.  **API Backend (`/src/api-go`)**: 
    *   **Tecnología**: Go (Golang) con Gin Framework.
    *   **Persistencia**: GORM con PostgreSQL.
    *   **Seguridad**: Middleware de Firebase para validar ID Tokens de Google.
    *   **Funciones**: API REST de alto rendimiento para todas las mecánicas de la campaña.

3.  **Database CLI (`/src/database-cli`)**:
    *   **Tecnología**: Go + Goose.
    *   **Función**: Herramienta independiente para gestionar migraciones de base de datos SQL versionadas.

---

## 🚀 Instalación y Despliegue (Docker)

La forma más sencilla de ejecutar todo el ecosistema es mediante Docker Compose:

```bash
docker-compose up --build
```

Esto levantará:
*   **PostgreSQL** en el puerto `5432`.
*   **Backend (Go)** en el puerto `8080`.
*   **Frontend (Next.js)** en el puerto `3000`.

---

## 🛡️ Seguridad y Autenticación

El sistema utiliza un flujo de **Autenticación Delegada**:

1.  El **Frontend** loguea al usuario en Firebase y obtiene un `ID Token`.
2.  El Frontend envía este token en cada petición al backend: `Authorization: Bearer <TOKEN>`.
3.  El **Backend** valida el token usando el SDK oficial de Firebase antes de entregar cualquier dato.

> [!IMPORTANT]
> Para que el backend funcione, debes colocar tu archivo de credenciales de Firebase en:
> `src/api-go/serviceAccountKey.json`

---

## 🗄️ Gestión de Base de Datos (Migraciones)

Hemos desacoplado las migraciones de la API para tener un historial claro del esquema.

### Comandos del CLI:
Navega a `src/database-cli` y usa:

*   **Ver estado**: `go run main.go status`
*   **Subir esquema**: `go run main.go up`
*   **Bajar esquema**: `go run main.go down`
*   **Nueva migración**: `go run main.go create nombre_del_cambio sql`

---

## 🧪 Contribuir

1.  Añade tus migraciones en `src/database-cli/migrations`.
2.  Define tus modelos en `src/api-go/models`.
3.  Crea tus handlers en `src/api-go/handlers`.
4.  ¡Lanza tus hechizos en el frontend! ✨

---

*“Que tus dados siempre rueden con ventaja.”* 🎲

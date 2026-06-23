# 📖 Documentación de la API

La documentación OpenAPI (Swagger), la especificación de los endpoints y los ejemplos JSON para pruebas se encuentran organizados en esta sección.

---

## 🛠️ Swagger (OpenAPI)

- **Archivo:** [`docs/swagger.yaml`](./docs/swagger.yaml)
- **Formato:** OpenAPI 3.0
- **Servidor base:** `http://localhost:8080`

Para visualizar la documentación de forma interactiva, podés importar el archivo YAML en cualquiera de estas herramientas online:
- [Swagger Editor](https://editor.swagger.io/) — Pegá o importá el contenido de `docs/swagger.yaml`.
- [Swagger UI](https://petstore.swagger.io/) — Usá "Explore" y cargá la URL del archivo si está hosteado, o importá el YAML de forma local.

## 📁 Ejemplos JSON para pruebas

En la carpeta [`docs/examples/`](./docs/examples/) se encuentra un archivo JSON por cada endpoint con ejemplos reales de *request* y/o *response*. Consultá el índice completo y detallado en [`docs/examples/README.md`](./docs/examples/README.md).

---

## ⚙️ Portabilidad y Configuración

### El archivo `.env.example`
En el desarrollo profesional, nunca se deben subir credenciales ni configuraciones críticas (como puertos o rutas de bases de datos) al repositorio. Para esto se utiliza un archivo `.env` local. 

Sin embargo, para garantizar la **portabilidad** del proyecto (que cualquier desarrollador pueda clonarlo y correrlo sin adivinar qué variables faltan), se proporciona el archivo **`.env.example`** como una plantilla pública con valores genéricos de referencia.

### Configuracion del entorno:
Creá tu archivo de configuración local duplicando la plantilla integrada. Bash: cp .env.example .env

### Variables requeridas en el proyecto:
* `PORT`: Puerto en el que correrá el servidor Express (ej: `8080`).
* `DB_STORAGE`: Ruta física para el archivo de persistencia de SQLite (ej: `./src/db/database.sqlite`).
* `DB_DIALECT`: Motor de base de datos utilizado (`sqlite`).
* `NODE_ENV`: Entorno de ejecución (`development` o `production`).

---

## 🚀 Inicio Rápido

1. **Clonar el proyecto e instalar las dependencias:**
   ```bash
   npm install

2. **Levantá el servidor:**

   ```bash
   npm run db:reset:dev   # Opcional: Resetea la BD e inyecta usuarios y posts de prueba
   npm run dev            # Levanta la API en el puerto configurado (ej: 8080)
   ```

3. **Probá un endpoint con curl:**

   ```bash
   curl http://localhost:8080/usuarios
   ```

   ```bash
   curl -X POST http://localhost:8080/usuario \
     -H "Content-Type: application/json" \
     -d @docs/examples/usuarios/post-usuario.request.json
   ```


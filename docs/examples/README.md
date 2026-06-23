# Ejemplos JSON por endpoint

Archivos de referencia para probar la API con herramientas como **curl**, **Postman** o **Thunder Client**.

**URL base:** `http://localhost:3000`

========================================================================
         DOCUMENTACIÓN TÉCNICA DE ENDPOINTS - API RED SOCIAL
========================================================================

------------------------------------------------------------------------
MÓDULO: PUBLICACIONES (Posts)
------------------------------------------------------------------------
* GET /posts
  - Middlewares: Ninguno.
  - Request (Payload): —
  - Response (JSON): [get-posts.response.json](./posts/posts.response/get-posts.response.json)
  - Descripción: Obtiene el listado global de todas las publicaciones con su caché optimizada.

* GET /post/:postId
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [get-post-id.response.json](./posts/posts.response/get-post-id.response.json)
  - Descripción: Obtiene el detalle de un post específico por su ID.

* POST /post
  - Middlewares: validateSchema(schemaPost)
  - Request (Payload): [post-post.request.json](./posts/posts.request/post-post.request.json)
  - Response (JSON): [post-post.response.json](./posts/post-post.response.json)
  - Descripción: Crea una nueva publicación en la red social. (Invalida caché global).

* PUT /posts/:id
  - Middlewares: validateSchema(schemaPost), validateExistsModel(Post)
  - Request (Payload): [put-post.request.json](./posts/posts.request/put-post.request.json)
  - Response (JSON): [put-post.response.json](./posts/put-post.response.json)
  - Descripción: Modifica el contenido de un post existente. (Invalida caché global e individual).

* DELETE /posts/:id
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [delete-post.response.json](./posts/posts.response/delete-post.response.json)
  - Descripción: Elimina un post de la base de datos de forma lógica/física. (Invalida caché global e individual).


------------------------------------------------------------------------
MÓDULO: IMÁGENES DE PUBLICACIONES (Post Images)
------------------------------------------------------------------------
* GET /post/:postId/images
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [get-images.response.json](./imagenes/imagenes.response/get-images.response.json)
  - Descripción: Obtiene todas las URLs de imágenes vinculadas a un post.

* GET /post/:postId/images/:imageId
  - Middlewares: validateExistsModel(Post), validateExistsModel(PostImage)
  - Request (Payload): —
  - Response (JSON): [get-image-id.response.json](./imagenes/imagenes.response/get-image-id.response.json)
  - Descripción: Obtiene el archivo o registro de una imagen específica de un post.

* POST /post/:postId/images
  - Middlewares: validateExistsModel(Post), validateSchema(schemaPostImage)
  - Request (Payload): [post-images.request.json](./imagenes/imagenes.request/post-images.request.json)
  - Response (JSON): [post-images.response.json](./imagenes/post-images.response.json)
  - Descripción: Sube y asocia nuevas imágenes a un posteo. (Invalida caché del post).

* PUT /post/:postId/images/:imageId
  - Middlewares: validateExistsModel(Post), validateExistsModel(PostImage), validateSchema(schemaPostImage), validatePutImage
  - Request (Payload): [put-image.request.json](./imagenes/imagenes.request/put-image.request.json)
  - Response (JSON): [put-image.response.json](./imagenes/put-image.response.json)
  - Descripción: Reemplaza o modifica los metadatos de una imagen. (Invalida caché del post).

* DELETE /post/:postId/images/:imageId
  - Middlewares: validateExistsModel(Post), validateExistsModel(PostImage)
  - Request (Payload): —
  - Response (JSON): [delete-image.response.json](./imagenes/imagenes.response/delete-image.response.json)
  - Descripción: Elimina una imagen puntual adjunta al post. (Invalida caché del post).

* DELETE /post/:postId/images
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [delete-all-images.response.json](./imagenes/imagenes.response/delete-all-images.response.json)
  - Descripción: Remueve en lote TODAS las imágenes que pertenezcan al posteo. (Invalida caché).


------------------------------------------------------------------------
MÓDULO: COMENTARIOS (Comments)
------------------------------------------------------------------------
* GET /post/:post_id/comments
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [get-comments.response.json](./comentarios/comentario.response/get-comments.response.json)
  - Descripción: Trae todos los comentarios asociados a un post específico.

* POST /post/:post_id/comment
  - Middlewares: validateExistsModel(Post), validarCreateComment
  - Request (Payload): [post-comment.request.json](./comentarios/comentario.request/post-comment.request.json)
  - Response (JSON): [post-comment.response.json](./comentarios/comentario.response/post-comment.response.json)
  - Descripción: Agrega un nuevo comentario a la publicación. (Invalida caché del post).

* PUT /post/:post_id/comment/:comment_id
  - Middlewares: validateExistsModel(Post), validateExistsModel(Comment), validarUpdateComment
  - Request (Payload): [put-comment.request.json](./comentarios/comentario.request/put-comment.request.json)
  - Response (JSON): [put-comment.response.json](./comentarios/comentario.response/put-comment.response.json)
  - Descripción: Modifica un comentario, validando que pertenezca al post indicado. (Invalida caché del post).

* DELETE /post/:post_id/comment/:comment_id
  - Middlewares: validateExistsModel(Post), validateExistsModel(Comment)
  - Request (Payload): —
  - Response (JSON): [delete-comment.response.json](./comentarios/comentario.response/delete-comment.response.json)
  - Descripción: Elimina un comentario específico de un post. (Invalida caché del post).


------------------------------------------------------------------------
MÓDULO: ETIQUETAS (Tags)
------------------------------------------------------------------------
* GET /tags
  - Middlewares: Ninguno.
  - Request (Payload): —
  - Response (JSON): [get-tags.response.json](./tags/tag.response/get-tags.response.json)
  - Descripción: Lista de forma global todos los tags/hashtags creados en la plataforma.

* GET /posts/:postId/tags
  - Middlewares: validateExistsModel(Post)
  - Request (Payload): —
  - Response (JSON): [get-post-tags.response.json](./tags/tag.response/get-post-tags.response.json)
  - Descripción: Obtiene las etiquetas que tiene asignadas un posteo específico.

* POST /posts/:postId/tags
  - Middlewares: validateExistsModel(Post), sanitizeTagName(), validateSchema(schemaTag)
  - Request (Payload): [post-post-tag.request.json](./tags/tag.request/post-post-tag.request.json)
  - Response (JSON): [post-post-tag.response-201.json](./tags/tag.response/post-post-tag.response-201.json) / [post-post-tag.response-200.json](./tags/post-post-tag.response-200.json)
  - Descripción: Crea y vincula un tag a un post (Relación Many-to-Many). (Invalida caché).

* DELETE /posts/:postId/tags/:tagName
  - Middlewares: validateExistsModel(Post), sanitizeTagName(), validarTagByName
  - Request (Payload): —
  - Response (JSON): [delete-post-tag.response.json](./tags/tag.response/delete-post-tag.response.json)
  - Descripción: Desvincula un tag específico de un posteo sin borrar el tag global. (Invalida caché).


------------------------------------------------------------------------
MÓDULO: USUARIOS (Users)
------------------------------------------------------------------------
* GET /usuarios
  - Middlewares: Ninguno.
  - Request (Payload): —
  - Response (JSON): [get-usuarios.response.json](./usuarios/get-usuarios.response.json)
  - Descripción: Lista todos los usuarios registrados (versión simplificada de administración).

* GET /usuario/:id
  - Middlewares: validateExistsModel(User)
  - Request (Payload): —
  - Response (JSON): [get-usuario-id.response.json](./usuarios/get-usuario-id.response.json)
  - Descripción: Obtiene la información básica de un usuario por su ID.

* GET /usuario/:id/posts
  - Middlewares: validateExistsModel(User)
  - Request (Payload): —
  - Response (JSON): [get-usuario-posts.response.json](./usuarios/get-usuario-posts.response.json)
  - Descripción: Trae exclusivamente el historial de publicaciones creadas por ese usuario.

* POST /usuario
  - Middlewares: validateSchema(schemaUser)
  - Request (Payload): [post-usuario.request.json](./usuarios/post-usuario.request.json)
  - Response (JSON): [post-usuario.response.json](./usuarios/post-usuario.response.json)
  - Descripción: Registra un usuario nuevo en el sistema con validación de esquema de datos.

* PUT /usuario/:id
  - Middlewares: validateSchema(schemaUser), validateExistsModel(User)
  - Request (Payload): [put-usuario.request.json](./usuarios/put-usuario.request.json)
  - Response (JSON): [put-usuario.response.json](./usuarios/put-usuario.response.json)
  - Descripción: Actualiza los datos de perfil (nombre, apellido, nickName) de un usuario.

* DELETE /usuario/:id
  - Middlewares: validateExistsModel(User)
  - Request (Payload): —
  - Response (JSON): [delete-usuario.response.json](./usuarios/delete-usuario.response.json)
  - Descripción: Da de baja a un usuario del sistema de forma definitiva.


------------------------------------------------------------------------
MÓDULO: BONUS (Interacciones y Perfil Completo)
------------------------------------------------------------------------
* GET /usuario/:id/profile
  - Middlewares: validateExistsModel(User)
  - Request (Payload): — 
  - Response (JSON): [get-user-profile.response.json](./followers/follow.response/get-user-profile.response.json)
  - Descripción: Perfil de Red Social. Trae los datos del usuario cruzados dinámicamente con sus listas de Seguidores (Followers) y Seguidos (Following).

* POST /usuario/:idFollower/follow/:idFollowing
  - Middlewares: validateFollow
  - Request (Payload): — 
  - Response (JSON): [post-follow.response.json](./followers/follow.response/post-follow.response.json)
  - Descripción: Ejecuta la acción donde el usuario idFollower comienza a seguir a idFollowing. Registra la relación en la tabla intermedia.

* POST /usuario/:idFollower/unfollow/:idFollowing
  - Middlewares: validateUnfollow
  - Request (Payload): — 
  - Response (JSON): [post-unfollow.response.json](./followers/follow.response/post-unfollow.response.json)
  - Descripción: Rompe el vínculo de seguimiento entre el usuario seguidor y el usuario seguido.

========================================================================

## Ejemplo con curl

```bash
# Crear un usuario
curl -X POST http://localhost:3000/usuario \
  -H "Content-Type: application/json" \
  -d @docs/examples/usuarios/post-usuario.request.json

# Listar posts
curl http://localhost:3000/posts

# Crear un comentario en el post 1
curl -X POST http://localhost:3000/v1/posts/1/comments \
  -H "Content-Type: application/json" \
  -d @docs/examples/comentarios/post-comment.request.json
```

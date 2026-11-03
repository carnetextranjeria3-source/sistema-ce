# Portal CE — gestión privada de registros

Aplicación Next.js 14 preparada para Vercel, MongoDB Atlas y Cloudinary. Incluye consulta pública limitada por número de documento + fecha de nacimiento, panel administrativo de un solo administrador, altas/edición/bajas, carga privada de archivos y registro básico de auditoría.

> **Uso permitido:** gestionar registros privados cuya administración y tratamiento estén autorizados. Este producto no es un portal de Migraciones, no consulta sistemas gubernamentales y no emite ni valida documentos oficiales. No utilice escudos, logotipos, sellos, marcas de agua ni diseños oficiales de forma que sugieran afiliación o autenticidad gubernamental. Los resultados públicos omiten fotografía, firma y archivos biométricos; estos no deben exponerse mediante una consulta abierta.

## 1. Requisitos
- Node.js 20 o superior.
- Cuenta MongoDB Atlas y base de datos dedicada.
- Cuenta Cloudinary.
- Cuenta Vercel y repositorio GitHub.

## 2. Configuración local
1. Descomprima el proyecto.
2. Ejecute `npm install`.
3. Copie `.env.example` a `.env.local`.
4. Complete `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` y las tres credenciales de Cloudinary.
5. Genere el hash bcrypt de la contraseña del administrador:
   ```bash
   node -e "const b=require('bcryptjs'); b.hash('CAMBIA_ESTA_CLAVE_LARGA',12).then(console.log)"
   ```
   Pegue el hash resultante en `ADMIN_PASSWORD_HASH`. No coloque la contraseña en el código ni en GitHub.
6. Genere un secreto de sesión de al menos 32 caracteres. En macOS/Linux: `openssl rand -base64 48`. En PowerShell: `[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))`.
7. Ejecute `npm run dev` y abra `http://localhost:3000`.

## 3. MongoDB Atlas
- Cree un usuario de base de datos dedicado con permisos mínimos sobre la base `portal_ce`.
- En Network Access permita solo las conexiones necesarias. Para Vercel puede ser necesario habilitar el rango de salida aplicable o configurar el acceso de red recomendado por Atlas para su plan; evite dejar `0.0.0.0/0` abierto permanentemente.
- Use una contraseña larga y exclusiva. Nunca comparta la URI ni la suba al repositorio.

## 4. Cloudinary
- Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` como variables del servidor.
- Las cargas se guardan con `type: authenticated` en `portal-ce-private`; no son URLs públicas. El panel almacena el identificador del recurso, no la imagen en MongoDB.
- La interfaz permite subir imágenes JPG/PNG/WEBP de hasta 5 MB. Si necesita archivos biométricos en otros formatos, diseñe y valide un flujo especializado antes de habilitarlo.
- Configure políticas de retención y eliminación en Cloudinary. Eliminar el registro de MongoDB no elimina automáticamente el archivo de Cloudinary: elimínelo desde una tarea administrativa controlada para evitar pérdidas accidentales.

## 5. Despliegue en Vercel
1. Suba el contenido de esta carpeta a un repositorio privado de GitHub.
2. En Vercel elija **Add New → Project** e importe el repositorio.
3. Framework: Next.js. Build command: `npm run build`.
4. En **Settings → Environment Variables**, agregue todas las variables de `.env.example` para Production (y Preview si corresponde). No agregue `.env.local` al repositorio.
5. Despliegue. Configure el dominio en Vercel y los DNS que Vercel indique para ese dominio.
6. Pruebe `/`, `/consulta` y `/admin`. Cree un registro de prueba y elimínelo después.

## 6. Rutas
- `/` — consulta pública privada.
- `/consulta` — ficha informativa limitada.
- `/admin` — panel de administración protegido.
- `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` — sesión de administrador.
- `/api/records` y `/api/records/[id]` — operaciones CRUD protegidas.
- `/api/upload` — carga privada protegida.
- `/api/public-query` — búsqueda limitada por documento y fecha de nacimiento.

## 7. Antes de usar con datos reales
- Reemplace el administrador único por un sistema de usuarios/roles si habrá más operadores.
- Añada limitación de solicitudes distribuida (por ejemplo Upstash Redis/Vercel Firewall) al endpoint público; no dependa de límites en memoria en funciones serverless.
- Añada CAPTCHA accesible o verificación adicional, alertas de abuso y registro de IP según su política de privacidad.
- Revise obligaciones legales aplicables al tratamiento de datos personales y biométricos, consentimiento, finalidad, acceso, conservación y eliminación. Los datos biométricos son especialmente sensibles.
- Configure copias de seguridad de Atlas y Cloudinary, pruebe restauración y defina retención.
- Para auditoría completa, registre también accesos, exportaciones, consultas, cambios de permisos y fallos de autenticación; el modelo incluido registra operaciones CRUD básicas.
- Realice pruebas de seguridad y privacidad antes de producción. Esta plantilla no sustituye una auditoría profesional ni una integración oficial.

## 8. Limitaciones funcionales actuales
- La consulta pública devuelve únicamente campos informativos; no devuelve fotografía, firma ni biometría.
- Los archivos se suben de forma privada, pero la interfaz no genera enlaces temporales de visualización. Esto evita exponer material sensible por URL pública.
- La aplicación usa un administrador configurado por variables de entorno; no incluye alta de usuarios ni recuperación de contraseña.
- No se incluye integración con sistemas de Migraciones ni validación gubernamental.

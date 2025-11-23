# DICRI - Sistema de Gestión de Evidencia - Frontend

Frontend desarrollado con React para el Sistema de Gestión de Evidencia del Ministerio Público de Guatemala - DICRI.

## 🚀 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación y rutas
- **Axios** - Cliente HTTP para consumir la API
- **Context API** - Manejo de estado global (autenticación)

## 📋 Características

### Módulos Implementados

1. **Autenticación**
   - Login con JWT
   - Protección de rutas
   - Manejo de sesión con localStorage

2. **Dashboard**
   - Estadísticas de expedientes por estado
   - Contador de expedientes (Borrador, En Revisión, Aprobados, Rechazados)
   - Acciones rápidas

3. **Gestión de Expedientes**
   - Listado con filtros (por estado y número MP)
   - Crear nuevo expediente
   - Editar expediente
   - Ver detalle completo
   - Cambios de estado según rol:
     - COORDINADOR: Enviar a revisión
     - ADMIN: Aprobar o rechazar

4. **Gestión de Indicios**
   - Agregar indicios a expedientes
   - Listar indicios asociados
   - Disponible para TECNICO, COORDINADOR y ADMIN

5. **Gestión de Usuarios** (Solo ADMIN)
   - Listar usuarios
   - Crear nuevos usuarios
   - Editar usuarios existentes
   - Asignar roles

### Roles del Sistema

- **ADMIN**: Acceso completo, aprobar/rechazar expedientes, gestionar usuarios
- **COORDINADOR**: Gestionar expedientes, enviar a revisión, gestionar indicios
- **TECNICO**: Ver expedientes, agregar indicios

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js >= 16
- npm o yarn
- API Backend ejecutándose en http://localhost:4000

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica) o navegar a la carpeta del proyecto

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

El archivo `.env` ya está configurado con:
```
VITE_API_URL=http://localhost:4000/api
```

Si tu API está en otra URL, modifica este archivo.

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación se abrirá automáticamente en http://localhost:3000

5. **Compilar para producción**
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Table.jsx
│   ├── Modal.jsx
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── PrivateRoute.jsx
├── context/            # Context API
│   └── AuthContext.jsx
├── pages/              # Páginas/Vistas
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Expedientes.jsx
│   ├── ExpedienteForm.jsx
│   ├── ExpedienteDetalle.jsx
│   └── Usuarios.jsx
├── services/           # Servicios de API
│   ├── api.js
│   ├── authService.js
│   ├── expedienteService.js
│   ├── indicioService.js
│   ├── userService.js
│   └── catalogoService.js
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada
```

## 🔐 Credenciales de Prueba

Según tu API, las credenciales por defecto son:

- **Usuario**: admin
- **Contraseña**: pass

## 🎨 Diseño y UX

- Diseño responsivo adaptado a móviles, tablets y desktop
- Tema profesional con colores institucionales del MP
- Componentes reutilizables y consistentes
- Validación de formularios
- Mensajes de error y confirmación
- Carga de estados (loading states)

## 🔄 Flujo de Trabajo de Expedientes

1. **TÉCNICO/COORDINADOR**: Crea expediente (estado: BORRADOR)
2. **COORDINADOR**: Envía expediente a revisión (estado: EN_REVISION)
3. **ADMIN**: 
   - Aprueba el expediente (estado: APROBADO)
   - O rechaza con motivo (estado: RECHAZADO, puede volver a BORRADOR)

## 📡 Integración con la API

Todos los servicios están configurados para consumir la API REST:

- **Base URL**: http://localhost:4000/api
- **Autenticación**: Bearer Token (JWT)
- **Headers**: Content-Type: application/json

### Endpoints Utilizados

- `POST /auth/login` - Autenticación
- `GET /expedientes` - Listar expedientes
- `POST /expedientes` - Crear expediente
- `GET /expedientes/:id` - Detalle de expediente
- `PUT /expedientes/:id` - Actualizar expediente
- `PUT /expedientes/:id/enviar-revision` - Enviar a revisión
- `PUT /expedientes/:id/aprobar` - Aprobar expediente
- `PUT /expedientes/:id/rechazar` - Rechazar expediente
- `GET /expedientes/conteo` - Conteo por estado
- `GET /expedientes/:id/indicios` - Listar indicios
- `POST /expedientes/:id/indicios` - Crear indicio
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `GET /catalogos/departamentos` - Departamentos
- `GET /catalogos/municipios/:id` - Municipios
- `GET /catalogos/estados-expediente` - Estados
- `GET /catalogos/roles` - Roles

## 🐛 Solución de Problemas

### La aplicación no se conecta a la API

1. Verifica que la API esté corriendo en http://localhost:4000
2. Revisa el archivo `.env` y confirma la URL correcta
3. Abre las DevTools del navegador y revisa la consola/network

### Error de CORS

Si hay errores de CORS, asegúrate de que tu API backend tenga configurado CORS para permitir peticiones desde http://localhost:3000

### Token expirado

Si el token JWT expira, la aplicación automáticamente redirigirá al login. Vuelve a iniciar sesión.

## 📦 Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## 🚢 Despliegue

Para desplegar en producción:

1. Actualiza `.env` con la URL de tu API en producción
2. Ejecuta `npm run build`
3. Despliega la carpeta `dist/` en tu servidor web (Nginx, Apache, etc.)
4. O usa servicios como Vercel, Netlify, etc.

## 📝 Notas Adicionales

- La aplicación usa localStorage para mantener la sesión
- Los interceptores de Axios manejan automáticamente la autenticación
- Todos los formularios tienen validación básica
- Las rutas están protegidas según el rol del usuario

## 👨‍💻 Desarrollo

Para continuar el desarrollo:

1. Los componentes están en `src/components/`
2. Para agregar nuevas páginas, créalas en `src/pages/` y agrégalas a las rutas en `App.jsx`
3. Para nuevos servicios de API, créalos en `src/services/`
4. Los estilos globales están en `src/index.css`

---

**Desarrollado para el Ministerio Público de Guatemala - DICRI**

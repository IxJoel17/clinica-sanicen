|# Clínica Sanicen - Frontend React

Proyecto frontend de la Clínica Sanicen desarrollado con React y Vite.

## Tecnologías Utilizadas

- **React 18.2.0** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 5.0.8** - Herramienta de construcción y desarrollo rápida
- **React Router DOM 6.20.0** - Enrutamiento para aplicaciones React
- **Node.js 22.0.0** - Entorno de ejecución de JavaScript

## Estructura del Proyecto

```
ClinicaSanicen_fe/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   ├── pages/               # Páginas/Vistas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Portal.jsx
│   │   ├── Citas.jsx
│   │   ├── Perfil.jsx
│   │   ├── Tratamiento.jsx
│   │   ├── Nosotros.jsx
│   │   ├── Contacto.jsx
│   │   └── ...
│   ├── App.jsx              # Componente principal con rutas
│   ├── main.jsx             # Punto de entrada de la aplicación
│   └── index.css            # Estilos globales
├── package.json
├── vite.config.js
└── index.html
```

## Instalación

1. Asegúrate de tener Node.js 22.0.0 instalado
2. Instala las dependencias:
```bash
npm install
```

## Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Construcción
```bash
npm run build
```
Genera una versión optimizada para producción en la carpeta `dist/`

### Vista Previa
```bash
npm run preview
```
Vista previa de la versión de producción

## Rutas de la Aplicación

- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/registro` - Registro de nuevo usuario
- `/portal` - Portal del paciente (requiere autenticación)
- `/citas` - Gestión de citas médicas
- `/perfil` - Perfil del paciente
- `/tratamiento` - Tratamientos en curso
- `/nosotros` - Sobre nosotros
- `/contacto` - Información de contacto
- `/recuperar-paso1` - Recuperar contraseña (paso 1)
- `/recuperar-paso2` - Recuperar contraseña (paso 2)
- `/registro-medico` - Historial de registros médicos
- `/receta-electronica` - Recetas médicas electrónicas
- `/confirmar-cita` - Confirmar cita médica
- `/detalle-registro` - Detalle de registro médico

## Características

- ✨ Interfaz moderna y responsive
- 🎨 Diseño consistente con los colores de la marca
- 🔄 Navegación fluida con React Router
- 📱 Compatible con dispositivos móviles
- ⚡ Desarrollo rápido con Vite

## Notas

- Las imágenes referenciadas en los estilos (como `foto-edificio.jpg`, `tu-imagen-hospital.jpg`) deben ser agregadas a la carpeta `public/` del proyecto.
- Los enlaces a recursos externos pueden necesitar ajustes según el entorno de producción.

## Desarrollo Futuro

- Integración con backend API
- Autenticación y autorización
- Manejo de estado global (Context API o Redux)
- Validación de formularios
- Manejo de errores
- Testing


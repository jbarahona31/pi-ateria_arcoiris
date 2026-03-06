# 🌈 Piñatería y Papelería Arcoiris — Sistema Web de Gestión

Sistema web completo de gestión de inventario, ventas y contabilidad para la tienda **Piñatería y Papelería Arcoiris**.

---

## 📋 Descripción

Sistema de gestión empresarial que permite administrar el inventario de productos, registrar ventas mediante un sistema POS, controlar gastos del negocio y visualizar reportes financieros. Diseñado con los colores del arcoíris para reflejar la identidad de la tienda.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js 18** (con Vite como bundler)
- **CSS moderno** (variables CSS, Flexbox, Grid)
- **Axios** — peticiones HTTP al backend
- **React Router DOM 6** — navegación entre páginas

### Backend
- **Node.js** — entorno de ejecución
- **Express.js** — framework web
- **MySQL 2** — driver para base de datos
- **JWT (jsonwebtoken)** — autenticación con tokens
- **bcryptjs** — encriptación de contraseñas
- **CORS** — habilitación de peticiones cross-origin
- **dotenv** — variables de entorno

### Base de Datos
- **MySQL** — sistema de gestión de base de datos relacional

---

## 📁 Estructura del Proyecto

```
pi-ateria_arcoiris/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # Configuración del pool de conexiones MySQL
│   ├── controllers/
│   │   ├── authController.js      # Lógica de autenticación y usuarios
│   │   ├── productController.js   # CRUD de productos
│   │   ├── salesController.js     # Lógica de ventas y POS
│   │   └── expensesController.js  # Registro de gastos
│   ├── routes/
│   │   ├── authRoutes.js          # Rutas /api/auth
│   │   ├── productRoutes.js       # Rutas /api/productos
│   │   ├── salesRoutes.js         # Rutas /api/ventas
│   │   ├── expensesRoutes.js      # Rutas /api/gastos
│   │   ├── dashboardRoutes.js     # Rutas /api/dashboard
│   │   └── reportesRoutes.js      # Rutas /api/reportes
│   ├── middleware/
│   │   └── authMiddleware.js      # Verificación JWT y roles
│   ├── models/
│   │   ├── userModel.js           # Modelo de usuario
│   │   ├── productModel.js        # Modelo de producto
│   │   ├── saleModel.js           # Modelo de venta
│   │   └── expenseModel.js        # Modelo de gasto
│   ├── server.js                  # Servidor principal Express
│   ├── .env.example               # Ejemplo de variables de entorno
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Barra de navegación superior
│   │   │   ├── Sidebar.jsx        # Menú lateral de navegación
│   │   │   └── Card.jsx           # Tarjeta estadística reutilizable
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Página de inicio de sesión
│   │   │   ├── Dashboard.jsx      # Panel principal con resumen
│   │   │   ├── Inventario.jsx     # CRUD de productos
│   │   │   ├── Ventas.jsx         # Sistema POS
│   │   │   ├── Gastos.jsx         # Registro de gastos
│   │   │   └── Reportes.jsx       # Reportes y estadísticas
│   │   ├── services/
│   │   │   └── api.js             # Configuración Axios y servicios API
│   │   ├── App.jsx                # Componente raíz y rutas
│   │   ├── App.css                # Estilos globales
│   │   └── main.jsx               # Punto de entrada React
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   └── arcoiris_db.sql            # Script de creación de base de datos
│
└── README.md
```

---

## 🗄️ Configuración de la Base de Datos

### 1. Crear la base de datos

Asegúrese de tener MySQL instalado y corriendo. Luego ejecute el script SQL:

```bash
mysql -u root -p < database/arcoiris_db.sql
```

O desde el cliente MySQL:

```sql
SOURCE /ruta/al/proyecto/database/arcoiris_db.sql;
```

El script creará:
- La base de datos `arcoiris_db`
- Las tablas: `usuarios`, `productos`, `ventas`, `detalle_ventas`, `gastos`
- Un usuario administrador de demostración
- Algunos productos de ejemplo

### 2. Credenciales del usuario de demostración

| Campo | Valor |
|-------|-------|
| Email | admin@arcoiris.com |
| Contraseña | admin123 |
| Rol | Administrador |

---

## 🚀 Instrucciones de Instalación

### Requisitos previos
- Node.js 18+ instalado
- MySQL 8+ instalado y corriendo
- npm o yarn

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/jbarahona31/pi-ateria_arcoiris.git
cd pi-ateria_arcoiris
```

### Paso 2: Configurar el Backend

```bash
# Entrar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
cp .env.example .env

# Editar .env con sus credenciales de MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=su_contraseña
# DB_NAME=arcoiris_db
# JWT_SECRET=arcoiris_secret_key_2024
# PORT=5000
```

### Paso 3: Configurar la Base de Datos

```bash
# Importar el esquema SQL
mysql -u root -p < ../database/arcoiris_db.sql
```

### Paso 4: Configurar el Frontend

```bash
# Volver a la raíz y entrar al frontend
cd ../frontend

# Instalar dependencias
npm install
```

---

## ▶️ Ejecutar el Proyecto

### Iniciar el Backend

```bash
cd backend

# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

El servidor correrá en: `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend

# Modo desarrollo
npm run dev

# Modo producción (construir)
npm run build
npm run preview
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🌐 API REST — Endpoints

### Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/register` | Registrar usuario | No |
| GET | `/api/auth/usuarios` | Listar usuarios | Sí (admin) |
| DELETE | `/api/auth/usuarios/:id` | Eliminar usuario | Sí (admin) |

### Productos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/productos` | Obtener todos los productos | Sí |
| GET | `/api/productos/:id` | Obtener un producto | Sí |
| POST | `/api/productos` | Crear producto | Sí |
| PUT | `/api/productos/:id` | Actualizar producto | Sí |
| DELETE | `/api/productos/:id` | Eliminar producto | Sí |

### Ventas
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/ventas` | Todas las ventas | Sí |
| POST | `/api/ventas` | Crear venta | Sí |
| GET | `/api/ventas/dia` | Ventas del día | Sí |
| GET | `/api/ventas/mes` | Ventas del mes | Sí |

### Gastos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/gastos` | Todos los gastos | Sí |
| POST | `/api/gastos` | Registrar gasto | Sí |
| DELETE | `/api/gastos/:id` | Eliminar gasto | Sí |

### Dashboard y Reportes
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard` | Resumen del dashboard | Sí |
| GET | `/api/reportes/ventas-dia` | Reporte ventas del día | Sí |
| GET | `/api/reportes/ventas-mes` | Reporte ventas del mes | Sí |
| GET | `/api/reportes/gastos` | Reporte de gastos | Sí |
| GET | `/api/reportes/ganancias` | Reporte de ganancias | Sí |
| GET | `/api/reportes/productos-mas-vendidos` | Top productos vendidos | Sí |

---

## 🎨 Diseño e Interfaz

Los colores del sistema están inspirados en el arcoíris:

| Color | Código Hex | Uso |
|-------|-----------|-----|
| 🔴 Rojo | `#FF4B4B` | Alertas, eliminar, gastos |
| 🟠 Naranja | `#FF9F1C` | Editar, advertencias |
| 🟡 Amarillo | `#FFD60A` | Destacados |
| 🟢 Verde | `#2EC4B6` | Éxito, ventas, agregar |
| 🔵 Azul | `#4361EE` | Acciones primarias |
| 🟣 Morado | `#8338EC` | Ganancias, estadísticas |

---

## 📸 Módulos del Sistema

### 🔐 Login
- Diseño moderno con gradiente
- Validación de credenciales con JWT
- Manejo de errores amigable

### 📊 Dashboard
- Tarjetas coloridas con estadísticas del día
- Ventas, gastos, ganancias y total de productos
- Acceso rápido a módulos principales

### 📦 Inventario
- Tabla moderna con todos los productos
- Formulario modal para crear/editar
- Búsqueda en tiempo real
- Indicador visual de stock bajo

### 🛒 Ventas (POS)
- Catálogo visual de productos disponibles
- Carrito de compra interactivo
- Control de cantidades
- Reducción automática de inventario al finalizar

### 💸 Gastos
- Formulario para registrar gastos rápidamente
- Historial de gastos en tabla
- Total acumulado en tarjeta

### 📈 Reportes
- Ventas del día y del mes
- Ganancias netas (ventas - gastos)
- Top 10 productos más vendidos con ranking

---

## 🔒 Seguridad

- Contraseñas encriptadas con **bcryptjs** (salt rounds: 10)
- Autenticación mediante **JWT** (expira en 8 horas)
- Rutas protegidas por middleware de verificación de token
- Control de roles: `admin` y `empleado`
- CORS configurado para orígenes permitidos

---

## 👨‍💻 Créditos

Desarrollado para **Piñatería y Papelería Arcoiris** 🌈

- **Tecnologías**: React, Node.js, Express, MySQL
- **Diseño**: Colores inspirados en el arcoíris

---

## 📄 Licencia

Este proyecto es de uso privado para Piñatería y Papelería Arcoiris.
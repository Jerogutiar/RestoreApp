# RestorApp - Sistema de Gestión de Pedidos

Este proyecto es un sistema completo de gestión de pedidos para un restaurante, desarrollado con **.NET 8 (Backend)** y **Angular 19 (Frontend)**, utilizando **PostgreSQL** como base de datos.

## 📋 Requisitos Previos

Asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   [PostgreSQL](https://www.postgresql.org/download/) (Opcional si usas la DB remota configurada)
*   [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

---

## 🚀 Ejecución del Proyecto

### 1. Base de Datos
El proyecto ya está configurado para conectarse a una base de datos remota (`51.222.142.204`).
*   No necesitas ejecutar ningún script SQL manual.
*   El backend (**DbInitializer**) se encarga de crear las tablas y sembrar datos de prueba (Admin, Productos) automáticamente al iniciar.

### 2. Backend (.NET 8)
El backend corre en el puerto `5052`.

1.  Abrir una terminal en la carpeta `backend`:
    ```bash
    cd backend
    ```
2.  Ejecutar el servidor:
    ```bash
    dotnet run --launch-profile http
    ```
3.  Verificar que está corriendo:
    *   Health Check: http://localhost:5052/api/health
    *   Swagger UI: http://localhost:5052/swagger

### 3. Frontend (Angular)
El frontend corre en el puerto `4200`.

1.  Abrir una **nueva** terminal en la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instalar dependencias (solo la primera vez):
    ```bash
    npm install
    ```
3.  Iniciar el servidor de desarrollo:
    ```bash
    npm start
    ```
    *(Nota: `npm start` ejecuta `ng serve`)*

4.  Abrir en el navegador: http://localhost:4200

---

## 🔑 Credenciales de Acceso

### Administrador (Acceso total)
*   **Email:** `admin@restorapp.com`
*   **Password:** `admin123`
*   **Rol:** ADMIN (Puede gestionar productos y cambiar estado de pedidos)

### Usuario (Cliente)
*   Puedes registrar un nuevo usuario desde la opción **"Sign Up"**.
*   O usar el usuario de prueba (si fue creado):
    *   **Email:** `user@test.com`
    *   **Password:** `user123`

---

## 🛠️ Estructura del Proyecto

### Backend (`/backend`)
*   **Controllers:** Endpoints de la API (Auth, Products, Orders).
*   **Models:** Entidades de la BD (User, Product, Order, OrderItem).
*   **Data:** Configuración de Entity Framework y DbContext.
*   `appsettings.json`: Cadena de conexión a PostgreSQL.

### Frontend (`/frontend`)
*   **src/app/components:**
    *   `auth`: Login y Registro.
    *   `products`: Catálogo de productos (ProductList).
    *   `orders`: Historial de pedidos y detalle.
    *   `admin`: Dashboard y gestión (ManageProducts, ManageOrders).
    *   `shared`: Spinner, Navbar.
*   **src/app/services:** Comunicación con la API (AuthService, ProductService, OrderService).
*   **src/app/guards:** Protección de rutas (AuthGuard, RoleGuard).
*   **src/app/interceptors:** Manejo de Tokens, Errores y Spinner.

---

## ✨ Características Implementadas
*   ✅ **Autenticación JWT:** Registro y Login seguro.
*   ✅ **Roles:** Separación estricta entre USER y ADMIN.
*   ✅ **Gestión de Pedidos:**
    *   USER: Crear pedidos, ver historial, cancelar (si está pendiente).
    *   ADMIN: Ver todos los pedidos, cambiar estados (Pending -> Preparing -> Delivered).
*   ✅ **Validaciones:** Control de stock, cálculo de totales en backend.
*   ✅ **UI Moderna:** Diseño responsive con Tailwind CSS, Badges de estado, y Spinner de carga.

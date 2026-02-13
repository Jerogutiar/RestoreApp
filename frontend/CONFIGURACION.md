# RestorApp - Sistema de Gestión de Pedidos

## 📋 Configuración Actual del Proyecto

### ✅ Lo que ya está implementado:

1. **Componente de Autenticación (Auth)**
   - Formulario de Login con Email y Password
   - Formulario de Registro con Name, Email, Password y Role
   - Cambio dinámico entre Login y Registro
   - Validaciones básicas de formulario
   - Mensajes de éxito y error
   - Estado de carga (loading)

2. **Servicio de Autenticación (AuthService)**
   - Métodos `login()` y `register()` preparados para conectar con backend
   - Almacenamiento de token en localStorage
   - Verificación de autenticación
   - Obtención de usuario actual y rol
   - Método de logout
   - Decodificación básica de JWT

3. **Modelos de Datos**
   - Interface `User` con campos según la guía
   - Interface `AuthResponse` para respuestas del backend
   - Interface `LoginRequest` y `RegisterRequest`
   - Interface `TokenPayload` para decodificar JWT

4. **Configuración**
   - HttpClient habilitado en app.config.ts
   - Archivo de environment con URLs configurables
   - Estilos con Tailwind CSS

### 🔧 Cómo funciona actualmente (SIN backend):

El sistema está configurado con **simulaciones** para que puedas ver cómo funciona sin tener el backend:

- En `auth.component.ts` hay dos funciones: `simulateLogin()` y `simulateRegister()`
- Estas funciones crean tokens y usuarios falsos
- Los datos se guardan en localStorage
- Puedes ver en la consola del navegador los datos guardados

### 🚀 Cómo conectar con el backend REAL:

Cuando tengas tu backend listo, sigue estos pasos:

#### Paso 1: Configurar la URL del backend

Edita el archivo: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // ← Cambia esto por tu URL
  // ...resto del código
};
```

#### Paso 2: Activar el código real en auth.component.ts

En el archivo `src/app/components/auth/auth.component.ts`:

1. **Busca estas líneas en `onLogin()`:**
```typescript
// IMPORTANTE: Como estamos usando una API falsa, simulamos la respuesta
this.simulateLogin(loginData);
```

2. **Reemplázalas por:**
```typescript
this.realLogin(loginData);
```

3. **Haz lo mismo en `onRegister()`:**
```typescript
// Cambia esto:
this.simulateRegister(registerData);
// Por esto:
this.realRegister(registerData);
```

4. **Descomenta el código que está al final del archivo** (las funciones `realLogin` y `realRegister`)

#### Paso 3: ¡Listo!

Ahora tu aplicación hará peticiones reales al backend. El backend debe responder con este formato:

**Login/Register Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "USER"
  }
}
```

### 🧪 Cómo probar el sistema ACTUAL:

1. Abre la aplicación en el navegador: http://localhost:4200
2. Verás el formulario de Login en la ruta `/auth/login`
3. Haz clic en "Sign up" para cambiar a `/auth/register`
4. La URL en el navegador cambiará automáticamente
5. Llena el formulario:
   - Name: Tu nombre
   - Email: test@test.com
   - Password: 123456 (mínimo 6 caracteres)
   - Role: USER o ADMIN
6. Haz clic en "Sign Up"
7. Verás un mensaje de éxito
8. Abre la Consola del navegador (F12) y verás los datos guardados
9. Abre las DevTools → Application → Local Storage y verás el token

**Rutas disponibles:**
- `/auth/login` - Formulario de inicio de sesión
- `/auth/register` - Formulario de registro
- `/` - Redirige automáticamente a `/auth/login`

### 📁 Estructura de Archivos:

```
src/
├── app/
│   ├── components/
│   │   └── auth/
│   │       ├── auth.component.ts     ← Lógica del formulario
│   │       ├── auth.component.html   ← Diseño del formulario
│   │       └── auth.component.css
│   ├── services/
│   │   └── auth.service.ts           ← Servicio de autenticación
│   ├── models/
│   │   └── user.model.ts             ← Interfaces de datos
│   ├── app.config.ts                 ← Configuración de Angular
│   └── app.routes.ts                 ← Rutas de la aplicación
└── environments/
    └── environment.ts                ← URLs del backend
```

**Rutas configuradas:**
- `/` → Redirige a `/auth/login`
- `/auth/login` → Componente de Login
- `/auth/register` → Componente de Registro
- El componente Auth detecta automáticamente la ruta y muestra el formulario correspondiente

### 📝 Próximos Pasos (según la guía):

1. **Guards (Protección de Rutas):**
   - AuthGuard - Verificar si está logueado
   - RoleGuard - Verificar rol (USER/ADMIN)
   - NoAuthGuard - Evitar acceso a login si ya está logueado

2. **Interceptors:**
   - AuthInterceptor - Agregar token automáticamente
   - ErrorInterceptor - Manejo centralizado de errores
   - LoadingInterceptor - Spinner automático


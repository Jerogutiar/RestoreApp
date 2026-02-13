// === Auth Models ===

export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'User' | 'Admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface TokenPayload {
  [key: string]: any;
  nameid: string;    // ClaimTypes.NameIdentifier
  email: string;     // ClaimTypes.Email
  role: string;      // ClaimTypes.Role
  exp: number;
}

// === Product Models ===

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  linkImage?: string;
  createdAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  linkImage?: string;
  isActive: boolean;
}

// === Order Models ===

export type OrderStatus = 'Pending' | 'Preparing' | 'Delivered' | 'Cancelled';

export interface Order {
  id: number;
  userId: number;
  user?: User;
  status: OrderStatus;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateOrderStatusDto {
  status: string;
}

// === Cart Models ===

export interface CartItem {
  product: Product;
  quantity: number;
}

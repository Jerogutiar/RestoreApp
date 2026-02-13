import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Auth routes (no auth guard - only accessible when NOT logged in)
  {
    path: 'auth/login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'auth/register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  { path: 'auth', redirectTo: '/auth/login', pathMatch: 'full' },

  // User routes
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () => import('./components/products/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./components/orders/order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/orders/order-detail.component').then(m => m.OrderDetailComponent)
  },

  // Admin routes
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/products',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadComponent: () => import('./components/admin/manage-products.component').then(m => m.ManageProductsComponent)
  },
  {
    path: 'admin/orders',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadComponent: () => import('./components/admin/manage-orders.component').then(m => m.ManageOrdersComponent)
  },

  // Fallback
  { path: '**', redirectTo: '/auth/login' }
];

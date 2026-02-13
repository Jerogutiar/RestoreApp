import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order, Product } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">📊 Panel de Administración</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow p-6">
            <p class="text-sm text-gray-500">Productos Totales</p>
            <p class="text-3xl font-bold text-gray-900">{{ products().length }}</p>
            <p class="text-xs text-green-500 mt-1">{{ activeProductCount() }} activos</p>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <p class="text-sm text-gray-500">Pedidos Totales</p>
            <p class="text-3xl font-bold text-gray-900">{{ orders().length }}</p>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <p class="text-sm text-gray-500">Pedidos Pendientes</p>
            <p class="text-3xl font-bold text-yellow-600">{{ pendingOrderCount() }}</p>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <p class="text-sm text-gray-500">Ingresos Totales</p>
            <p class="text-3xl font-bold text-green-600">\${{ totalRevenue().toFixed(2) }}</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a routerLink="/admin/products" class="bg-white rounded-xl shadow p-6 hover:shadow-md transition flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">🍔</div>
            <div>
              <h3 class="font-semibold text-gray-900">Gestionar Productos</h3>
              <p class="text-sm text-gray-500">Crear, editar y desactivar productos</p>
            </div>
          </a>
          <a routerLink="/admin/orders" class="bg-white rounded-xl shadow p-6 hover:shadow-md transition flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
            <div>
              <h3 class="font-semibold text-gray-900">Gestionar Pedidos</h3>
              <p class="text-sm text-gray-500">Ver y cambiar estado de pedidos</p>
            </div>
          </a>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Pedidos Recientes</h2>
          @if (orders().length === 0) {
            <p class="text-gray-500">No hay pedidos aún.</p>
          } @else {
            <div class="divide-y">
              @for (order of orders().slice(0, 5); track order.id) {
                <div class="py-3 flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Pedido #{{ order.id }}</span>
                    <span class="text-sm text-gray-500 ml-2">{{ order.user?.name || 'Usuario' }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-gray-900">\${{ order.total.toFixed(2) }}</span>
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                          [class]="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);
  totalRevenue = signal(0);
  activeProductCount = computed(() => this.products().filter(p => p.isActive).length);
  pendingOrderCount = computed(() => this.orders().filter(o => o.status === 'Pending').length);

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (p) => this.products.set(p)
    });
    this.orderService.getOrders().subscribe({
      next: (o) => {
        this.orders.set(o);
        const delivered = o.filter(order => order.status === 'Delivered');
        this.totalRevenue.set(delivered.reduce((sum, order) => sum + order.total, 0));
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Preparing': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

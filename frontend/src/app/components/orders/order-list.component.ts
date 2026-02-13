import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/user.model';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">📦 Mis Pedidos</h1>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        } @else if (orders().length === 0) {
          <div class="bg-white rounded-xl shadow p-12 text-center">
            <p class="text-gray-500 text-xl mb-4">No tienes pedidos aún</p>
            <a routerLink="/products" class="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition">
              Ver Productos
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of orders(); track order.id) {
              <div class="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm text-gray-500">Pedido #{{ order.id }}</span>
                    <p class="text-lg font-bold text-gray-900">\${{ order.total.toFixed(2) }}</p>
                    <p class="text-sm text-gray-400">{{ order.createdAt | date:'medium' }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ order.orderItems?.length || 0 }} producto(s)</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold"
                          [class]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                    @if (order.status === 'Pending') {
                      <button (click)="cancelOrder(order)" class="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                        Cancelar
                      </button>
                    }
                    <a [routerLink]="['/orders', order.id]" class="text-sm px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                      Ver detalle
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class OrderListComponent implements OnInit {
    orders = signal<Order[]>([]);
    loading = signal(true);

    constructor(private orderService: OrderService) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.loading.set(true);
        this.orderService.getOrders().subscribe({
            next: (orders) => {
                this.orders.set(orders);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    cancelOrder(order: Order) {
        if (!confirm('¿Estás seguro de cancelar este pedido?')) return;
        this.orderService.cancelOrder(order.id).subscribe({
            next: () => this.loadOrders()
        });
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Preparing': 'bg-blue-100 text-blue-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return map[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            'Pending': '⏳ Pendiente',
            'Preparing': '👨‍🍳 Preparando',
            'Delivered': '✅ Entregado',
            'Cancelled': '❌ Cancelado'
        };
        return map[status] || status;
    }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/user.model';

@Component({
    selector: 'app-manage-orders',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900">📦 Gestionar Pedidos</h1>
          <!-- Filter -->
          <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Todos</option>
            <option value="Pending">Pendientes</option>
            <option value="Preparing">Preparando</option>
            <option value="Delivered">Entregados</option>
            <option value="Cancelled">Cancelados</option>
          </select>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        } @else if (filteredOrders().length === 0) {
          <div class="bg-white rounded-xl shadow p-12 text-center">
            <p class="text-gray-500 text-xl">No se encontraron pedidos</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of filteredOrders(); track order.id) {
              <div class="bg-white rounded-xl shadow overflow-hidden">
                <!-- Order Header -->
                <div class="p-6 flex items-center justify-between cursor-pointer" (click)="toggleExpand(order.id)">
                  <div class="flex items-center gap-4">
                    <div>
                      <span class="text-sm text-gray-500">Pedido #{{ order.id }}</span>
                      <p class="font-semibold text-gray-900">{{ order.user?.name || 'Usuario #' + order.userId }}</p>
                      <p class="text-sm text-gray-400">{{ order.createdAt | date:'medium' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-xl font-bold text-gray-900">\${{ order.total.toFixed(2) }}</span>
                    <!-- Status Change -->
                    <select [ngModel]="order.status" (ngModelChange)="changeStatus(order, $event)" (click)="$event.stopPropagation()"
                      class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      [disabled]="order.status === 'Cancelled' || order.status === 'Delivered'">
                      <option value="Pending">⏳ Pendiente</option>
                      <option value="Preparing">👨‍🍳 Preparando</option>
                      <option value="Delivered">✅ Entregado</option>
                      <option value="Cancelled">❌ Cancelado</option>
                    </select>
                    <span class="text-gray-400">{{ expandedOrder() === order.id ? '▲' : '▼' }}</span>
                  </div>
                </div>

                <!-- Order Items (expanded) -->
                @if (expandedOrder() === order.id) {
                  <div class="border-t bg-gray-50 p-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Productos del pedido</h3>
                    <div class="divide-y divide-gray-200">
                      @for (item of order.orderItems; track item.id) {
                        <div class="flex items-center justify-between py-2">
                          <div class="flex items-center gap-3">
                            <img [src]="item.product?.linkImage || 'https://placehold.co/40x40/22c55e/white?text=P'" class="w-8 h-8 rounded object-cover" />
                            <span class="text-gray-900">{{ item.product?.name || 'Producto #' + item.productId }}</span>
                          </div>
                          <div class="text-sm text-gray-600">
                            {{ item.quantity }} × \${{ item.price.toFixed(2) }} = <span class="font-bold">\${{ (item.quantity * item.price).toFixed(2) }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ManageOrdersComponent implements OnInit {
    orders = signal<Order[]>([]);
    loading = signal(true);
    expandedOrder = signal<number | null>(null);
    statusFilter = '';

    filteredOrders = () => {
        if (!this.statusFilter) return this.orders();
        return this.orders().filter(o => o.status === this.statusFilter);
    };

    constructor(private orderService: OrderService) { }

    ngOnInit() { this.loadOrders(); }

    loadOrders() {
        this.loading.set(true);
        this.orderService.getOrders().subscribe({
            next: (orders) => { this.orders.set(orders); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
    }

    onFilterChange() {
        // filteredOrders is computed dynamically
    }

    toggleExpand(orderId: number) {
        this.expandedOrder.set(this.expandedOrder() === orderId ? null : orderId);
    }

    changeStatus(order: Order, newStatus: string) {
        this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
            next: () => this.loadOrders()
        });
    }
}

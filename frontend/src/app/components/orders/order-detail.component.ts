import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/user.model';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-3xl mx-auto">
        <a routerLink="/orders" class="text-green-600 hover:underline mb-6 inline-block">← Volver a mis pedidos</a>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        } @else if (order()) {
          <div class="bg-white rounded-xl shadow p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Pedido #{{ order()!.id }}</h1>
                <p class="text-sm text-gray-400">{{ order()!.createdAt | date:'full' }}</p>
              </div>
              <span class="px-4 py-2 rounded-full text-sm font-semibold"
                    [class]="getStatusClass(order()!.status)">
                {{ getStatusLabel(order()!.status) }}
              </span>
            </div>

            <!-- Items -->
            <h2 class="font-semibold text-gray-700 mb-3">Productos</h2>
            <div class="divide-y">
              @for (item of order()!.orderItems; track item.id) {
                <div class="flex items-center gap-4 py-3">
                  <img
                    [src]="item.product?.linkImage || 'https://placehold.co/60x60/22c55e/white?text=P'"
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ item.product?.name || 'Producto #' + item.productId }}</p>
                    <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }} × \${{ item.price.toFixed(2) }}</p>
                  </div>
                  <p class="font-bold text-gray-900">\${{ (item.quantity * item.price).toFixed(2) }}</p>
                </div>
              }
            </div>

            <!-- Total -->
            <div class="border-t mt-4 pt-4 flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-700">Total</span>
              <span class="text-2xl font-bold text-green-600">\${{ order()!.total.toFixed(2) }}</span>
            </div>
          </div>

          @if (order()!.status === 'Pending') {
            <button (click)="cancelOrder()" class="w-full border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-medium">
              Cancelar Pedido
            </button>
          }
        } @else {
          <div class="bg-white rounded-xl shadow p-12 text-center">
            <p class="text-gray-500 text-xl">Pedido no encontrado</p>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
    order = signal<Order | null>(null);
    loading = signal(true);

    constructor(
        private orderService: OrderService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.orderService.getOrder(id).subscribe({
            next: (order) => {
                this.order.set(order);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    cancelOrder() {
        if (!confirm('¿Estás seguro de cancelar este pedido?')) return;
        this.orderService.cancelOrder(this.order()!.id).subscribe({
            next: () => {
                const current = this.order()!;
                this.order.set({ ...current, status: 'Cancelled' });
            }
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

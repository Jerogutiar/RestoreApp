import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CreateOrderDto } from '../../models/user.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">🛒 Mi Carrito</h1>

        @if (cartService.items().length === 0) {
          <div class="bg-white rounded-xl shadow p-12 text-center">
            <p class="text-gray-500 text-xl mb-4">Tu carrito está vacío</p>
            <button (click)="goProducts()" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition">
              Ver Productos
            </button>
          </div>
        } @else {
          <div class="bg-white rounded-xl shadow divide-y">
            @for (item of cartService.items(); track item.product.id) {
              <div class="flex items-center gap-4 p-4">
                <img
                  [src]="item.product.linkImage || 'https://placehold.co/100x100/22c55e/white?text=' + item.product.name"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ item.product.name }}</h3>
                  <p class="text-green-600 font-medium">\${{ item.product.price.toFixed(2) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition">−</button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition">+</button>
                </div>
                <p class="font-bold text-gray-900 w-24 text-right">\${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                <button (click)="cartService.removeItem(item.product.id)" class="text-red-500 hover:text-red-700 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            }
          </div>

          <!-- Total & Actions -->
          <div class="mt-6 bg-white rounded-xl shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg text-gray-600">Total ({{ cartService.itemCount() }} items)</span>
              <span class="text-3xl font-bold text-green-600">\${{ cartService.total().toFixed(2) }}</span>
            </div>
            @if (error()) {
              <div class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{{ error() }}</div>
            }
            <div class="flex gap-3">
              <button (click)="cartService.clearCart()" class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition">
                Vaciar Carrito
              </button>
              <button (click)="placeOrder()" [disabled]="placing()" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                {{ placing() ? 'Procesando...' : '✅ Realizar Pedido' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CartComponent {
  placing = signal(false);
  error = signal('');

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  goProducts() {
    this.router.navigate(['/products']);
  }

  placeOrder() {
    this.placing.set(true);
    this.error.set('');

    const orderDto: CreateOrderDto = {
      items: this.cartService.items().map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: () => {
        this.placing.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err: any) => {
        this.placing.set(false);
        this.error.set(err.error?.message || err.error || 'Error al crear el pedido');
      }
    });
  }
}

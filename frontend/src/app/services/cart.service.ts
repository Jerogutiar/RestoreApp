import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = signal<CartItem[]>(this.loadCart());

    readonly items = this.cartItems.asReadonly();
    readonly itemCount = computed(() => this.cartItems().reduce((sum, i) => sum + i.quantity, 0));
    readonly total = computed(() => this.cartItems().reduce((sum, i) => sum + (i.product.price * i.quantity), 0));

    private loadCart(): CartItem[] {
        try {
            const data = localStorage.getItem('cart');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private saveCart(): void {
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }

    addItem(product: Product, quantity: number = 1): void {
        const current = this.cartItems();
        const existing = current.find(i => i.product.id === product.id);

        if (existing) {
            this.cartItems.set(
                current.map(i => i.product.id === product.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                )
            );
        } else {
            this.cartItems.set([...current, { product, quantity }]);
        }
        this.saveCart();
    }

    removeItem(productId: number): void {
        this.cartItems.set(this.cartItems().filter(i => i.product.id !== productId));
        this.saveCart();
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        this.cartItems.set(
            this.cartItems().map(i => i.product.id === productId ? { ...i, quantity } : i)
        );
        this.saveCart();
    }

    clearCart(): void {
        this.cartItems.set([]);
        localStorage.removeItem('cart');
    }
}

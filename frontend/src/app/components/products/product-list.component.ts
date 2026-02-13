import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/user.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  addedMessage = signal('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term)
    );
  });

  // Computed for Admin check
  isAdmin = computed(() => this.authService.getCurrentUser()?.role === 'Admin');

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.productService.getActiveProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
    this.addedMessage.set(`${product.name} Added`);
    setTimeout(() => this.addedMessage.set(''), 2000);
  }
}

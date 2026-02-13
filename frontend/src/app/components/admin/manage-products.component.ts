import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductRequest } from '../../models/user.model';

@Component({
    selector: 'app-manage-products',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900">🍔 Gestionar Productos</h1>
          <button (click)="openForm()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium">
            + Nuevo Producto
          </button>
        </div>

        <!-- Product Form Modal -->
        @if (showForm()) {
          <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" (click)="closeForm()">
            <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ editing() ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
              <form (ngSubmit)="saveProduct()" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input type="number" [(ngModel)]="form.price" name="price" step="0.01" min="0.01" required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" [(ngModel)]="form.stock" name="stock" min="0" required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                  <input type="text" [(ngModel)]="form.linkImage" name="linkImage"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" id="isActive" class="w-4 h-4 text-green-600" />
                  <label for="isActive" class="text-sm text-gray-700">Producto activo</label>
                </div>
                @if (formError()) {
                  <div class="p-2 bg-red-100 text-red-700 rounded text-sm">{{ formError() }}</div>
                }
                <div class="flex gap-2 pt-2">
                  <button type="button" (click)="closeForm()" class="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                  <button type="submit" [disabled]="saving()" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-50">
                    {{ saving() ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }

        <!-- Products Table -->
        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        } @else {
          <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                @for (product of products(); track product.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img [src]="product.linkImage || 'https://placehold.co/40x40/22c55e/white?text=P'" class="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p class="font-medium text-gray-900">{{ product.name }}</p>
                          <p class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900">\${{ product.price.toFixed(2) }}</td>
                    <td class="px-6 py-4">
                      <span [class]="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">{{ product.stock }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs font-semibold"
                            [class]="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ product.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button (click)="editProduct(product)" class="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Editar</button>
                        @if (product.isActive) {
                          <button (click)="toggleActive(product)" class="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">Desactivar</button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class ManageProductsComponent implements OnInit {
    products = signal<Product[]>([]);
    loading = signal(true);
    showForm = signal(false);
    editing = signal(false);
    saving = signal(false);
    formError = signal('');
    editingId = 0;

    form: ProductRequest = this.emptyForm();

    constructor(private productService: ProductService) { }

    ngOnInit() { this.loadProducts(); }

    loadProducts() {
        this.loading.set(true);
        this.productService.getAllProducts().subscribe({
            next: (p) => { this.products.set(p); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
    }

    emptyForm(): ProductRequest {
        return { name: '', description: '', price: 0, stock: 0, linkImage: '', isActive: true };
    }

    openForm() {
        this.form = this.emptyForm();
        this.editing.set(false);
        this.formError.set('');
        this.showForm.set(true);
    }

    editProduct(product: Product) {
        this.form = { name: product.name, description: product.description || '', price: product.price, stock: product.stock, linkImage: product.linkImage || '', isActive: product.isActive };
        this.editingId = product.id;
        this.editing.set(true);
        this.formError.set('');
        this.showForm.set(true);
    }

    closeForm() { this.showForm.set(false); }

    saveProduct() {
        if (!this.form.name || this.form.price <= 0) {
            this.formError.set('Nombre y precio son obligatorios');
            return;
        }
        this.saving.set(true);

        const obs = this.editing()
            ? this.productService.updateProduct(this.editingId, this.form)
            : this.productService.createProduct(this.form);

        obs.subscribe({
            next: () => { this.saving.set(false); this.closeForm(); this.loadProducts(); },
            error: (err) => { this.saving.set(false); this.formError.set(err.error?.message || 'Error al guardar'); }
        });
    }

    toggleActive(product: Product) {
        if (!confirm(`¿Desactivar "${product.name}"?`)) return;
        this.productService.deleteProduct(product.id).subscribe({
            next: () => this.loadProducts()
        });
    }
}

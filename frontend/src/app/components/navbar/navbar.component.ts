import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  private router = inject(Router);

  cartCount = this.cartService.itemCount;

  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  userName = computed(() => this.currentUser()?.name || 'Guest');

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

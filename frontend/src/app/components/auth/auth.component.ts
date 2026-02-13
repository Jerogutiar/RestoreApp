import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  isLogin = signal(true);
  name = signal('');
  email = signal('');
  password = signal('');
  message = signal('');
  messageType = signal<'success' | 'error'>('error');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUrl = this.router.url;
    this.isLogin.set(currentUrl.includes('/login'));
  }

  toggleMode() {
    this.message.set('');
    this.name.set('');
    this.email.set('');
    this.password.set('');

    if (this.isLogin()) {
      this.router.navigate(['/auth/register']);
      this.isLogin.set(false);
    } else {
      this.router.navigate(['/auth/login']);
      this.isLogin.set(true);
    }
  }

  onLogin() {
    if (!this.email() || !this.password()) {
      this.showMessage('Por favor, completa todos los campos', 'error');
      return;
    }
    if (!this.email().includes('@')) {
      this.showMessage('Por favor, ingresa un email válido', 'error');
      return;
    }
    if (this.password().length < 6) {
      this.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    const loginData: LoginRequest = {
      email: this.email(),
      password: this.password()
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.loading.set(false);
        this.showMessage('¡Inicio de sesión exitoso!', 'success');
        setTimeout(() => this.redirectByRole(), 500);
      },
      error: (error) => {
        this.loading.set(false);
        this.showMessage(error.error?.message || 'Error al iniciar sesión', 'error');
      }
    });
  }

  onRegister() {
    if (!this.name() || !this.email() || !this.password()) {
      this.showMessage('Por favor, completa todos los campos', 'error');
      return;
    }
    if (!this.email().includes('@')) {
      this.showMessage('Por favor, ingresa un email válido', 'error');
      return;
    }
    if (this.password().length < 6) {
      this.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    const registerData: RegisterRequest = {
      name: this.name(),
      email: this.email(),
      password: this.password()
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.loading.set(false);
        this.showMessage('¡Registro exitoso!', 'success');
        setTimeout(() => this.redirectByRole(), 500);
      },
      error: (error) => {
        this.loading.set(false);
        this.showMessage(error.error?.message || 'Error al registrarse', 'error');
      }
    });
  }

  private redirectByRole() {
    const role = this.authService.getUserRole();
    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/products']);
    }
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message.set(msg);
    this.messageType.set(type);
  }
}

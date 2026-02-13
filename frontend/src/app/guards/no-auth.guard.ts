import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Already logged in — redirect based on role
    const role = authService.getUserRole();
    if (role === 'Admin') {
        router.navigate(['/admin/dashboard']);
    } else {
        router.navigate(['/products']);
    }
    return false;
};

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedRole = route.data['role'] as string;
    const userRole = authService.getUserRole();

    if (userRole === expectedRole) {
        return true;
    }

    // Redirect based on role
    if (userRole === 'Admin') {
        router.navigate(['/admin/dashboard']);
    } else {
        router.navigate(['/products']);
    }
    return false;
};

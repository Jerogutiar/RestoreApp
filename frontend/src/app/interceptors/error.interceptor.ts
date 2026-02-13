import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {
            switch (error.status) {
                case 401:
                    authService.logout();
                    break;
                case 403:
                    alert('No tienes permisos para realizar esta acción.');
                    break;
                case 404:
                    console.error('Recurso no encontrado:', error.url);
                    break;
                case 500:
                    alert('Error interno del servidor. Intenta de nuevo más tarde.');
                    break;
            }
            return throwError(() => error);
        })
    );
};

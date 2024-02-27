import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.guard.service';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // Token existe, permite el acceso a la ruta
    } else {
      this.router.navigate(['/auth/login']); // Token no existe, redirige a la página de inicio de sesión
      return false; // Evita el acceso a la ruta protegida
    }
  }
}

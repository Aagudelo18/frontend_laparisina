import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
}) export class LoginService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  //Proceso de login, donde el párametro Usuario data envía los datos del usuario par validar su inicio de sesión
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response?.token;
        const userRole = response?.usuario?.rol_usuario; // Obtener el rol del usuario

        if (token && userRole) {
          // Realizar una solicitud adicional al servidor para obtener el nombre del rol
          this.http.get<any>(`${this.apiUrl}/roles/${userRole}`).subscribe(roleResponse => {
            const roleName = roleResponse?.nombre_rol; // Obtener el nombre del rol
            if (roleName) {
              const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Tiempo de expiración: una hora en milisegundos
              localStorage.setItem('token', token);
              localStorage.setItem('rol', roleName); // Almacena el nombre del rol
              localStorage.setItem('expirationTime', expirationTime.toString());
  
              this.isAuthenticatedSubject.next(true);
  
              // Eliminar el token después de una hora
              setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('rol');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('expirationTime');
                this.isAuthenticatedSubject.next(false);
              }, 60 * 60 * 1000); // 1 hora en milisegundos
            }
          });
        }
      })
    );
  }


  logout(): void {
    // Eliminar el token y actualizar el estado de autenticación
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  getAuthenticated(): Observable<boolean> {
    return this.isAuthenticated;
  }

  private sessionExpired = new Subject<void>();
  sessionExpired$ = this.sessionExpired.asObservable();

  checkSessionValidity() {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (parseInt(expirationTime, 10) < currentTime) {
        // Emitir un evento para mostrar el diálogo de sesión expirada
        this.sessionExpired.next();
        // Limpiar el almacenamiento local y realizar otras tareas necesarias
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('expirationTime');
      }
    }
  }
}
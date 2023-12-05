import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
}) export class RecuperarContrasenaService {
    private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';

    constructor(private http: HttpClient) { }

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    //Traer todos los usuarios
    getUsuarios() {
        return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
    }

    //Proceso de login, donde el páramettro Usuario data envía los datos del usaurio par avalidar su inicio de sesión
    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                const token = response?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    this.isAuthenticatedSubject.next(true);
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

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';

    constructor(private http: HttpClient) { }
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    //Método para obtener la lista de roles desde la API
    getRoles() {
        // Obtener el token y el rol del local storage
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');

        // Crear el encabezado con el token y el rol
        const headers = {
            'Content-Type': 'application/json',
            'token': token || '',
            'rol': rol || ''
        };

        return this.http.get<any[]>(`${this.apiUrl}/roles`, { headers });
    }

    //Traer todos los usuarios
    getUsuarios() {
        // Obtener el token y el rol del local storage
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');

        // Crear el encabezado con el token y el rol
        const headers = {
            'Content-Type': 'application/json',
            'token': token || '',
            'rol': rol || ''
        };

        return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
    }   

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    setAuthenticated(value: boolean): void {
        this.isAuthenticatedSubject.next(value);
    }






}

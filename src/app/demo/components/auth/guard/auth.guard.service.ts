import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    getRol(userRole: any, token: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/roles/${userRole}`);
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    setAuthenticated(value: boolean): void {
        this.isAuthenticatedSubject.next(value);
    }

    // Método para obtener información de roles y permisos del usuario
    getUserPermissions(userRole: any): Observable<string[]> {
        return this.getRol(userRole, 'token').pipe(
            map(response => response.permisos_rol.map(permiso => permiso.nombre_permiso))
        );
    }
    
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
}) export class RestaurarContrasenaService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();
    private resetToken: string | null = null;

    getAuthenticated(): Observable<boolean> {
        return this.isAuthenticated;
    }

    forgotPassword(correo_electronico: string): Observable<any> {
        // Aquí puedes hacer la solicitud para restablecer la contraseña
        const body = { correo_electronico: correo_electronico };
        return this.http.post<any>(`${this.apiUrl}/forgot-password`, body);
    }


    resetPassword(newPassword: string, token: string): Observable<any> {
        if (!token) {
            throw new Error('No se ha proporcionado un token para restablecer la contraseña');
        }
        

        const body = { newPassword, token };
        return this.http.post<any>(`${this.apiUrl}/reset-password`, body)
            .pipe(
                tap(() => {
                    // Si se restablece la contraseña con éxito, se limpia el token
                    this.resetToken = null;
                })
            );
    }

    // Setter para guardar el token
    setResetToken(token: string): void {
        this.resetToken = token;
    }

}
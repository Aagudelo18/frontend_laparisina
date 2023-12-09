import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
}) export class RecuperarContrasenaService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    forgotPassword(correo_electronico: string): Observable<any> {
        // Aquí puedes hacer la solicitud para restablecer la contraseña
        const body = { correo_electronico: correo_electronico };
        return this.http.post<any>(`${this.apiUrl}/forgot-password`, body);
}

}
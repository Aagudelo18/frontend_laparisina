import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
}) export class LoginService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    //Traer todos los usuarios
    getUsuarios() {
        return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
    }

    Login(usuarioData: any) {
        return this.http.post(`${this.apiUrl}/login`, usuarioData);
    }

}
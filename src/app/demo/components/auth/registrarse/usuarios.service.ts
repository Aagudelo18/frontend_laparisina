import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
}) export class UsuarioService {
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';

  constructor(private http: HttpClient) { }

  //Traer todos los usuarios
  getUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  //Método para obtener la lista de roles desde la API
  getRoles() {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  // Crear usuario con token y rol en el encabezado
  createUsuario(usuarioData: any): Observable<any> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

    // Hacer la solicitud HTTP con los encabezados
    return this.http.post(`${this.apiUrl}/usuarios`, usuarioData, { headers });
  }

  //Obtener un usuario por ID
  getUsuarioPorId(uid: string) {
    const url = `${this.apiUrl}/usuarios/${uid}`;
    return this.http.get<any>(url);
  }

  //Actualizar un usuario
  updateUsuario(uid: string, usuarioData: any) {
    const url = `${this.apiUrl}/usuarios/${uid}`;

    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

    // Hacer la solicitud HTTP con los encabezados
    return this.http.put(url, usuarioData, { headers });
  }
  
}
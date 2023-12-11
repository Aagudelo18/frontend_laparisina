import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
}) export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  //Traer todos los usuarios
  getUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  //Método para obtener la lista de roles desde la API
  getRoles() {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  //Crear usuario
  createUsuario(usuarioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuarioData);
  }

  //Obtener un usuario por ID
  getUsuarioPorId(uid: string) {
    const url = `${this.apiUrl}/usuarios/${uid}`;
    return this.http.get<any>(url);
  }

  //Actualizar un usuario
  updateUsuario(uid: string, usuarioData: any) {
    const url = `${this.apiUrl}/usuarios/${uid}`;
    return this.http.put(url, usuarioData);
  }
  
  //Actualizar estado de un usuario.
  actualizarEstadoUsuario(uid: string, usuarioData: any) {
    const url = `${this.apiUrl}/usuario-estado/${uid}`;
    return this.http.put(url, usuarioData);
  }
  //Eliminar un usuario
  deleteUsuario(uid: string) {
    const url = `${this.apiUrl}/usuarios/${uid}`;
    return this.http.delete(url);
  }


}
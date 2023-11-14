import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  //Método para obtener la lista de roles desde la API
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }
}

@Injectable({
  providedIn: 'root'
}) export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  //Traer todos los usuarios
  getUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  //Crear usuario
  createUsuario(usuarioData: any) {
    return this.http.post(`${this.apiUrl}/usuarios`, usuarioData);
  }

  //Obtener un usuario por ID
  getUsuarioPorId(id: string) {
    const url = `${this.apiUrl}/usuarios/${id}`;
    return this.http.get<any>(url);
  }

  //Actualizar un usuario
  updateUsuario(id: string, usuarioData: any) {
    const url = `${this.apiUrl}/usuarios/${id}`;
    return this.http.put(url, usuarioData);
  }

  //Eliminar un usuario
  deleteUsuario(id: string) {
    const url = `${this.apiUrl}/usuarios/${id}`;
    return this.http.delete(url);
  }
  
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '//localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { }

  //Traer todos los usuarios
  getUsuarios() {
    return this.http.get<any[]>(this.apiUrl);
  }

  //Crear usuario
  createUsuario(usuarioData: any) {
    return this.http.post(this.apiUrl, usuarioData);
  }

  //Obtener un usuario por ID
  getUsuarioPorId(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  //Actualizar un usuario
  updateUsuario(id: string, usuarioData: any) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, usuarioData);
  }

  //Eliminar un usuario
  deleteUsuario(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
  
}
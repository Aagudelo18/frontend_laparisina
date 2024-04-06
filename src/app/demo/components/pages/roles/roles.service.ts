import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Roles } from './roles.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/roles';
  private apiUrl2 = 'https://api-parisina-2tpy.onrender.com/api';

  constructor(private http: HttpClient) { }

  getListRoles(): Observable<Roles[]>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Roles[]>(this.apiUrl, {headers})       
  }

  getRoles(id:string): Observable<Roles>{
    return this.http.get<Roles>(`${this.apiUrl}/${id}`)
  }

  postRoles(Roles : Roles):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.post<void>(this.apiUrl,Roles, {headers})
  }

  putRoles(id:string, Roles:Roles):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`,Roles, {headers})
  }

  actualizarEstadoRol(id:string): Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl2}/roles_estado/${id}`,{}, {headers})
    }
  
  
}

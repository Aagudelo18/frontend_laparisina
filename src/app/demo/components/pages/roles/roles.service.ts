import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from './roles.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
<<<<<<<<< Temporary merge branch 1
  private apiUrl = 'http://api-parisina-2tpy.onrender.com/api/roles';
=========
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/roles';
>>>>>>>>> Temporary merge branch 2

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  createRoles(newRoles: Rol): Observable<any> {
    return this.http.post(this.apiUrl, newRoles);
  }

  private apiUrlestado = 'http://localhost:3000/api/roles_estado';
  cambiarEstadoRol(id: string) {
    return this.http.put<void>(`${this.apiUrlestado}/${id}`, {}); // Utiliza la URL correcta
  }
  
}


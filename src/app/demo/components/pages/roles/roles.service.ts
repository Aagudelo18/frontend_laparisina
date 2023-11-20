import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from './roles.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/roles';

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  createRoles(newRoles: Rol): Observable<any> {
    return this.http.post(this.apiUrl, newRoles);
  }

  private apiUrlestado = 'https://api-parisina-2tpy.onrender.com/api/roles_estado';
  cambiarEstadoRol(id: string) {
    return this.http.put<void>(`${this.apiUrlestado}/${id}`, {}); // Utiliza la URL correcta
  }
  
}


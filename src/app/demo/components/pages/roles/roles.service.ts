import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Roles } from './roles.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:3000/api/';
  private apiUrl2 = 'https://api-parisina-2tpy.onrender.com/api';

  constructor(private http: HttpClient) { }

  getListRoles(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.apiUrl + 'roles')       
  }

  getRoles(id:string): Observable<Roles>{
    return this.http.get<Roles>(`${this.apiUrl}/${id}`)
  }

  postRoles(Roles : Roles):Observable<void>{
    return this.http.post<void>(this.apiUrl,Roles)
  }

  putRoles(id:string, Roles:Roles):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${id}`,Roles)
  }

  actualizarEstadoRol(id:string): Observable<void>{
    return this.http.put<void>(`${this.apiUrl2}/roles_estado/${id}`,{})
    }
  
  
}

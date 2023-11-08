import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class RoleService {
  private apiUrl = 'http://api-parisina-2tpy.onrender.com/api/roles';
=======
export class RolesService {
  private apiUrl = 'http://localhost:3000/api/roles';
>>>>>>> 68a4fe0d1ca141e3dfec9da4f55b91819a2ee014

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
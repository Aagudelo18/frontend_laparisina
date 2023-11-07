import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/api/roles';

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
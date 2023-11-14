import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/roles';

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
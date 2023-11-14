import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) export class VentaService {
  private apiUrl = 'http://api-parisina-2tpy.onrender.com/api';

  constructor(private http: HttpClient) { }

  //Traer todas las ventas
  getVentas() {
    return this.http.get<any[]>(`${this.apiUrl}/ventas`);
  }

    
}
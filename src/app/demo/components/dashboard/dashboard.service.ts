import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../pages/ventas/ventas.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getVentas() {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

    return this.http.get<Pedido[]>(this.apiUrl + '/ventas', { headers });
  }

  getVentaDetalle(id: string): Observable<any> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

    return this.http.get<any>(this.apiUrl + `/ventas/${id}`);
  }


}

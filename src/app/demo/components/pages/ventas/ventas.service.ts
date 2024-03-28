import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './ventas.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';

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

    return this.http.get<any>(this.apiUrl + `/ventas/${id}`, { headers });
  }

  descargarVentasExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/ventas_excel`, { responseType: 'blob' });
  }
  
  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }

  getDomiciliariosXId(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados/${id}`);
  }
  

}

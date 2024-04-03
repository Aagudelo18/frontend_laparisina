import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './ventas.model';
import { Observable, map } from 'rxjs';



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
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    });

    // Opciones para la solicitud HTTP
    const options = {
      headers: headers, // Incluir el encabezado en las opciones
      responseType: 'blob' as 'json' // Especificar el tipo de respuesta como blob
    };

    // Realizar la solicitud HTTP GET con las opciones
    return this.http.get(`${this.apiUrl}/ventas_excel`, options).pipe(
      map(response => response as Blob) // Convertir la respuesta a Blob
    );
  }

  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }

  getDomiciliariosXId(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados/${id}`);
  }


}

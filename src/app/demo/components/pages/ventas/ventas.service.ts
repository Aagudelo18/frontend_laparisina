import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './ventas.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getVentas() {
    return this.http.get<Pedido[]>(this.apiUrl + '/ventas');
  }

  getVentaDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/ventas/${id}`);
  }
  
  descargarVentasExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/ventas_excel`, { responseType: 'blob' });
  }
  
}

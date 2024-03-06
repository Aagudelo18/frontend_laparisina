import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './pedidos.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // getPedidos() {
  //   return this.http.get<Pedido[]>(this.apiUrl + 'pedidos');
    
  // }
  getPedidos(): Observable<Pedido[]> {
    const url = `${this.apiUrl}pedidos`;

    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    });

    // Hacer la solicitud HTTP con los encabezados
    return this.http.get<Pedido[]>(url, { headers });
  }

  getPedidoDetalle(id: string): Observable<any> {
    return this.http.get<Pedido[]>(this.apiUrl + `pedidos/${id}` );
  }

  updatePedido(id: string, pedido: Pedido): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}pedidos/${id}`, pedido);
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosPendientes`);
  }

  getPedidosTerminados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosTerminados`);
  }

  getPedidosAnulados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosAnulados`);
  }

  getPedidosEnviados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosEnviados`);
  }

  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }

  getDomiciliariosXId(id: string): Observable<any> {
    console.log(`${this.apiUrl}/domiciliarios/${id}`);

    return this.http.get<any[]>(`${this.apiUrl}empleados/${id}`);
  }

  asignarPedidoDomiciliario(idPedido: string, idDomiciliario: string): Observable<any> {
    const url = `${this.apiUrl}empleados/asignar-pedido`;
    const body = { id_pedido: idPedido, id_empleado_domiciliario: idDomiciliario };
    return this.http.post(url, body);
  
  }

 

}
  
  

  


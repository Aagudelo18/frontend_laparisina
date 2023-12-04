import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './pedidos.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getPedidos() {
    return this.http.get<Pedido[]>(this.apiUrl + 'pedidos');
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


  public getDomiciliarios(): Observable<any>{
    return this.http.get(this.apiUrl + 'domiciliarios')
   }
  
}

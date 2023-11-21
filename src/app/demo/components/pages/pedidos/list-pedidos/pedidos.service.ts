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

  updatePedido(id: string,  nuevoEstado: string): Observable<any> {
    return this.http.put<Pedido[]>(`${this.apiUrl}pedidos/${id}`, { nuevoEstado });
  }
}

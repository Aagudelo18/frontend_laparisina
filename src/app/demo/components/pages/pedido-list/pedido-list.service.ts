import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from './pedido-model';

@Injectable()

export class PedidoListService {

  private carritoProductos = 'carritoProductosParisina';
  private datosCliente = 'currentUser'

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

//Metodo para listar todos los pedidos del cliente
  getTodosPedido(id: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/pedidosCliente/${id}`);
  }

  updatePedido(id: string, pedido: Cliente): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pedidos/${id}`, pedido);
  }

  getPedidoDetalle(id: string): Observable<any> {
    return this.http.get<Cliente[]>(this.apiUrl + `/pedidos/${id}` );
  }

 

  







}

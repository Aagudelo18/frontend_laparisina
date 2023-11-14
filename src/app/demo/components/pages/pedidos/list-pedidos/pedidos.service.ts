import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './pedidos.model';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/pedidos';

  constructor(private http: HttpClient) { }

  getPedidos() {
    return this.http.get<Pedido[]>(this.apiUrl);
  }
}

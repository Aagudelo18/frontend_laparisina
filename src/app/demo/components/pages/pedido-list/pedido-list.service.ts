import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from './pedido-model';

@Injectable()

export class PedidoListService {

  private carritoProductos = 'carritoProductosParisina';
  private datosCliente = 'currentUser'

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';

  constructor(private http: HttpClient) { }

//Metodo para listar todos los pedidos del cliente
  getTodosPedido(id: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/pedidosCliente/${id}`);
  }

  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }
  
  getDomiciliariosXId(id: string): Observable<any> {
    console.log(`${this.apiUrl}domiciliarios/${id}`);

    return this.http.get<any[]>(`${this.apiUrl}/empleados/${id}`);
  }

  getPedidoDetalle(id: string): Observable<any> {
    return this.http.get<Cliente[]>(this.apiUrl + `/pedidos/${id}` );
  }

  obtenerClientePorCorreo(correo_cliente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${correo_cliente}`);
  }




}
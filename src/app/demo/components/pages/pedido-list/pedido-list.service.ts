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
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Cliente[]>(`${this.apiUrl}/pedidosCliente/${id}`, {headers});
  }

  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }
  
  getDomiciliariosXId(id: string): Observable<any> {
    console.log(`${this.apiUrl}domiciliarios/${id}`);

    return this.http.get<any[]>(`${this.apiUrl}/empleados/${id}`);
  }

  getPedidoDetalle(id: string): Observable<any> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Cliente[]>(this.apiUrl + `/pedidos-cliente/${id}`, {headers} );
  }

  obtenerClientePorCorreo(correo_cliente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${correo_cliente}`);
  }




}
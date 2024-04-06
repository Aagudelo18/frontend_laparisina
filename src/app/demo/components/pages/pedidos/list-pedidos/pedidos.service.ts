import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from './pedidos.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/';

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
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Pedido[]>(this.apiUrl + `pedidos/${id}`, {headers} );
  }


  updatePedido(id: string, pedido: Pedido): Observable<any> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<any>(`${this.apiUrl}pedidos/${id}`, pedido, {headers});
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosPendientes`, {headers});
  }

  getPedidosTerminados(): Observable<Pedido[]> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosTerminados`, {headers});
  }

  getPedidosAnulados(): Observable<Pedido[]> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosAnulados`, {headers});
  }

  getPedidosEnviados(): Observable<Pedido[]> {
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosEnviados`, {headers});
  }
  getPedidosEntregadosConPagoPendiente(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidosEntregado`);
  }


  getDomiciliarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domiciliarios`);
  }

  getDomiciliariosXId(id: string): Observable<any> {
    console.log(`${this.apiUrl}domiciliarios/${id}`);

    return this.http.get<any[]>(`${this.apiUrl}empleados/${id}`);
  }

  asignarPedidoDomiciliario(idPedido: string, idDomiciliario: string): Observable<any> {
    const url = `${this.apiUrl}empleados/asignar-pedido`;
    const body = { id_pedido: idPedido, id_empleado_domiciliario: idDomiciliario };
    return this.http.post(url, body);
  
  }


  

}
  
  

  


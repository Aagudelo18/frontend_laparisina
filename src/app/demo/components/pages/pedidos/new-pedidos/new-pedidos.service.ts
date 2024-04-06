import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPedidosService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  public createPedido(pedidos: any): Observable<any>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.post(this.apiUrl + 'pedidos', pedidos, {headers})
  }

  public getAllCategorias(): Observable<any>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get(this.apiUrl + 'categorias', {headers})
  }

  public getAllProductos(): Observable<any>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get(this.apiUrl + 'productos', {headers})
  }
 
  public getCliente(numero_documento_cliente: string): Observable<any>{
      return this.http.get(this.apiUrl + `clientes/consultar/${numero_documento_cliente}`)
     }

     obtenerTransporteActivos(): Observable<void>{
      return this.http.get<void>(`${this.apiUrl}/transporteActivo`)
    }
  
  
}

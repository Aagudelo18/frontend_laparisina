import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()

  export class PedidoClienteService {

    private carritoProductos = 'carritoProductosParisina';

    private apiUrl = 'http://localhost:3000/api'; // URL de API

  constructor(private http: HttpClient) { }

  // public createPedidoCliente(pedidos: any): Observable<any>{
  //   return this.http.post(this.apiUrl + '/pedidosCliente', pedidos)
  // }

  public createPedido(pedidos: any): Observable<any>{
    return this.http.post(this.apiUrl + '/pedidos', pedidos)
  }

// Método para obtener los datos del cliente por su ID
obtenerClientePorCorreo(correo_cliente: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/cliente/${correo_cliente}`);
}
  // public createPedidoCliente(pedidos: any): Observable<any>{
  //   return this.http.post(this.apiUrl + 'pedidos', pedidos)
  // }79635

  //Servicios carrito localStorage
  guardarCarrito(carrito: any[]): void {
    localStorage.setItem(this.carritoProductos, JSON.stringify(carrito));
  }

  obtenerCarrito(): any[] {
    const listaGuardada = localStorage.getItem(this.carritoProductos);
    return listaGuardada ? JSON.parse(listaGuardada) : [];
  }

 

  limpiarLocalStorage(): void {
    localStorage.removeItem(this.carritoProductos);
  }


  guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carritoProductos));
  }
  

 
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

  export class PedidoClienteService {

    private carritoProductos = 'carritoProductosParisina';

    private apiUrl = 'http://localhost:3000/api'; // URL de API

  constructor(private http: HttpClient) { }

  // public createPedidoCliente(pedidos: any): Observable<any>{
  //   return this.http.post(this.apiUrl + 'pedidos', pedidos)
  // }

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

 
}


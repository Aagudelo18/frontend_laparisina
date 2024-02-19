import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product-list.model';

@Injectable()
  export class ProductService {

    private carritoProductos = 'carritoProductosParisina';
    private datosCliente = 'currentUser'

    private apiUrl = 'http://localhost:3000/api'; // URL de API
  
    constructor(private http: HttpClient) {}

    getListProducts(): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos`)    
    }

    getProduct(id:string): Observable<Product>{
      return this.http.get<Product>(`${this.apiUrl}/productos/${id}`)
    }
    
    getProductosPorCategoria(categoria: string): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos-categoria/${categoria}`)
    }
    

    //Servicios carrito localStorage
    guardarCarrito(carrito: any[]): void {
      localStorage.setItem(this.carritoProductos, JSON.stringify(carrito));
    }
  
    obtenerCarrito(): any[] {
      const carrito = localStorage.getItem(this.carritoProductos);
      return carrito ? JSON.parse(carrito) : [];
    }
  
    limpiarLocalStorage(): void {
      localStorage.removeItem(this.carritoProductos);
    }

    //Servicios cliente login
    obtenerDatosCliente(): any[] {
      const cliente = localStorage.getItem(this.datosCliente);
      return cliente ? JSON.parse(cliente) : [];
    }
  }
  
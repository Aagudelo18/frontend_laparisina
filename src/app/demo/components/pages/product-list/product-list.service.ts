import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, DatosUsuario } from './product-list.model';

@Injectable()
  export class ProductService {

    datosUsuario: DatosUsuario = {} as DatosUsuario;

    private carritoProductos = 'carritoProductosParisina';
    private claveDatosUsuario = 'currentUser'

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
    

  //-------------------------------------------------------------------------------------------------------------------------------

  //SERVICIOS Y FUNCIONES CARRITO

  //-------------------------------------------------------------------------------------------------------------------------------
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
    obtenerDatosUsuario(): DatosUsuario {
      const cliente = localStorage.getItem(this.claveDatosUsuario);
      return cliente ? JSON.parse(cliente) : {} as DatosUsuario;
    }

    obtenerDatosClientePorCorreo(correo:string): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/cliente/${correo}`)
    }
  }
  
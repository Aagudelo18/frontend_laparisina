import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './producto.model';

@Injectable()
  export class ProductoService {
    private apiUrl = 'https://api-parisina-2tpy.onrender.com/api'; // URL de API
  
    constructor(private http: HttpClient) {}

    getListProductos(): Observable<Producto[]>{
      return this.http.get<Producto[]>(`${this.apiUrl}/productos`)    
    }

    getProducto(id:string): Observable<Producto>{
      return this.http.get<Producto>(`${this.apiUrl}/productos/${id}`)
    }

    crearProducto(data : FormData): Observable<Object>{
      return this.http.post<Object>(`${this.apiUrl}/productos`,data)
    }

    actualizarProducto(id:string, data : FormData): Observable<Object>{
      return this.http.put<Object>(`${this.apiUrl}/productos/${id}`,data)
    }
  
    actualizarEstadoProducto(id:string): Observable<void>{
      return this.http.put<void>(`${this.apiUrl}/producto-estado/${id}`,{})
    }
    
  }
  
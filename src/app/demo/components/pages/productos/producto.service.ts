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
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'token': token || '',
        'rol': rol || ''
      };
      return this.http.post<Object>(`${this.apiUrl}/productos`,data, {headers})
    }

    actualizarProducto(id:string, data : FormData): Observable<Object>{
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'token': token || '',
        'rol': rol || ''
      };
      return this.http.put<Object>(`${this.apiUrl}/productos/${id}`,data, {headers})
    }
  
    actualizarEstadoProducto(id:string): Observable<void>{
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'token': token || '',
        'rol': rol || ''
      };
      return this.http.put<void>(`${this.apiUrl}/producto-estado/${id}`,{}, {headers})
    }
    
  }
  
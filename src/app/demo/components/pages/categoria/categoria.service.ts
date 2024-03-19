import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Categoria } from './categoria.model';

@Injectable()
  export class CategoriaService {
    private apiUrl = 'http://localhost:3000/api'; // URL de tu API
  
    constructor(private http: HttpClient) {}

    getListCategorias(): Observable<Categoria[]>{
      return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`)    
    }

    // CLIENTE
    getListCategorias_Cliente(): Observable<Categoria[]>{
      return this.http.get<Categoria[]>(`${this.apiUrl}/categorias-cliente`)    
    }

    getCategoria(id:string): Observable<Categoria>{
      return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`)
    }

    obtenerCategoriaPorNombre(nombreCategoria:string): Observable<Categoria>{
      return this.http.get<Categoria>(`${this.apiUrl}/categorias/consultar/${nombreCategoria}`)
    }

    crearCategoria(data : FormData): Observable<Object>{
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'token': token || '',
        'rol': rol || ''
      };
      return this.http.post<Object>(`${this.apiUrl}/categorias`,data, {headers})
    }

    actualizarCategoria(id:string, data : FormData): Observable<Object>{
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'token': token || '',
        'rol': rol || ''
      };

      
      return this.http.put<Object>(`${this.apiUrl}/categorias/${id}`,data, {headers})
    }
  
    actualizarEstadoCategoria(id:string): Observable<void>{
      // Obtener el token y el rol del local storage
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      // Crear el encabezado con el token y el rol
      const headers = {
        'Content-Type': 'application/json',
        'token': token || '',
        'rol': rol || ''
      };
      return this.http.put<void>(`${this.apiUrl}/categoria-estado/${id}`,{}, { headers})
    }
  }
  
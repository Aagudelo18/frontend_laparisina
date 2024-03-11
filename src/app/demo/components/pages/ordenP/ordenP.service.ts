import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenDeProduccion } from './ordenP.model';

@Injectable()
  export class OrdenDeProduccionService {
    private apiUrl = 'http://localhost:3000/api'; // URL de tu API
  
    constructor(private http: HttpClient) {}

    getListOrdenesDeProduccion(): Observable<OrdenDeProduccion[]>{
      // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

      return this.http.get<OrdenDeProduccion[]>(`${this.apiUrl}/consultar-produccion`, { headers })    
    }

    getOrdenDeProduccion(id:string): Observable<OrdenDeProduccion>{
      // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

      return this.http.get<OrdenDeProduccion>(`${this.apiUrl}/consultar-produccion/${id}`, { headers })
    }

    gerararOrdenesDeProduccion(idsPedidos: string[]):Observable<any>{
      // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

      return this.http.post(`${this.apiUrl}/crear-produccion`,{ idsPedidos }, { headers })
    }

    actualizarEstadoOrdenDeProduccion(id:string, estadoOrden: string):Observable<void>{
      // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'Content-Type': 'application/json',
      'token': token || '',
      'rol': rol || ''
    };

      return this.http.put<void>(`${this.apiUrl}/actualizar-produccion/${id}`,{ estado_orden: estadoOrden }, { headers })
    }

    public getPedidos(): Observable<any>{
      return this.http.get(this.apiUrl + '/pedidos')
    }
  }
  
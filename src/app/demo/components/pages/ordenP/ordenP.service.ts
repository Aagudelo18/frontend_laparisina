import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenDeProduccion } from './ordenP.model';

@Injectable()
  export class OrdenDeProduccionService {
    private apiUrl = 'http://localhost:3000/api'; // URL de tu API
  
    constructor(private http: HttpClient) {}

    getListOrdenesDeProduccion(): Observable<OrdenDeProduccion[]>{
      return this.http.get<OrdenDeProduccion[]>(`${this.apiUrl}/consultar-produccion`)    
    }

    getOrdenDeProduccion(id:string): Observable<OrdenDeProduccion>{
      return this.http.get<OrdenDeProduccion>(`${this.apiUrl}/consultar-produccion/${id}`)
    }
  }
  
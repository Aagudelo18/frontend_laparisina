import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transportes } from './transportes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportesService {
  private apiUrl = 'http://localhost:3000/api/transporte';
  private apiUrl2 = 'http://localhost:3000/api';


  constructor(private http: HttpClient) { }

  getListTransportes(): Observable<Transportes[]>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Transportes[]>(this.apiUrl, {headers})       
  }

  getTransportes(id:string): Observable<Transportes>{
    return this.http.get<Transportes>(`${this.apiUrl}/${id}`)
  }

  postTransportes(Transportes : Transportes):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.post<void>(this.apiUrl,Transportes, {headers})
  }

  putTransportes(id:string, Transportes:Transportes):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`,Transportes, {headers})
  }

  actualizarEstadoTransportes(id:string): Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl2}/transporte_estado/${id}`,{}, {headers})
  }
 
  
}

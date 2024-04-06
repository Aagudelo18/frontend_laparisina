import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Clientes } from './clientes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';
  private apiUrl2 = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  
  getListClientes(): Observable<Clientes[]>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.get<Clientes[]>(this.apiUrl, {headers})       
  }

  getClientes(id:string): Observable<Clientes>{
    return this.http.get<Clientes>(`${this.apiUrl}/${id}`)
  }

  postClientes(Clientes : Clientes):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.post<void>(this.apiUrl,Clientes, {headers})
  }

  putClientes(id:string, Clientes:Clientes):Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`,Clientes, {headers})
  }

  actualizarEstadoCliente(id:string): Observable<void>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    return this.http.put<void>(`${this.apiUrl2}/clientes_estado/${id}`,{}, {headers})
    }

descargarClientesExcel(): Observable<Blob> {
  // Obtener el token y el rol del local storage
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Crear el encabezado con el token y el rol
  const headers = {
    'token': token || '',
    'rol': rol || ''
  };
  return this.http.get(`${this.apiUrl2}/clientes_excel`, { responseType: 'blob', headers: headers });
}
}

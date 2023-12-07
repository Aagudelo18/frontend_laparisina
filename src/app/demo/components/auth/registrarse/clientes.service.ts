import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Clientes } from '../../pages/clientes/clientes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';
  private apiUrl2 = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  
  getListClientes(): Observable<Clientes[]>{
    return this.http.get<Clientes[]>(this.apiUrl)       
  }

  getClientes(id:string): Observable<Clientes>{
    return this.http.get<Clientes>(`${this.apiUrl}/${id}`)
  }

  postClientes(Clientes : Clientes):Observable<void>{
    return this.http.post<void>(this.apiUrl,Clientes)
  }

  putClientes(id:string, Clientes:Clientes):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${id}`,Clientes)
  }

  actualizarEstadoCliente(id:string): Observable<void>{
    return this.http.put<void>(`${this.apiUrl2}/clientes_estado/${id}`,{})
    }
}

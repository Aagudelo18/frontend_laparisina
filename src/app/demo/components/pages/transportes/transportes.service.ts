import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transportes } from './transportes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportesService {
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/transporte';
  private apiUrl2 = 'https://api-parisina-2tpy.onrender.com/api';


  constructor(private http: HttpClient) { }

  getListTransportes(): Observable<Transportes[]>{
    return this.http.get<Transportes[]>(this.apiUrl)       
  }

  getTransportes(id:string): Observable<Transportes>{
    return this.http.get<Transportes>(`${this.apiUrl}/${id}`)
  }

  postTransportes(Transportes : Transportes):Observable<void>{
    return this.http.post<void>(this.apiUrl,Transportes)
  }

  putTransportes(id:string, Transportes:Transportes):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${id}`,Transportes)
  }

  actualizarEstadoTransportes(id:string): Observable<void>{
    return this.http.put<void>(`${this.apiUrl2}/transporte_estado/${id}`,{})
  }
 
  
}

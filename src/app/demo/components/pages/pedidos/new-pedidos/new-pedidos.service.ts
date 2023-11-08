import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPedidosService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/pedidos';

  constructor(private http: HttpClient) { }

  public createPedido(pedidos: any): Observable<any>{
    return this.http.post(this.apiUrl, pedidos)
  }
  
}

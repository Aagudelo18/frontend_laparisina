import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPedidosService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/';

  constructor(private http: HttpClient) { }

  public createPedido(pedidos: any): Observable<any>{
    
    return this.http.post(this.apiUrl + 'pedidos', pedidos)
  }

  public getAllCategorias(): Observable<any>{
    return this.http.get(this.apiUrl + 'categorias')
  }

  public getAllProductos(): Observable<any>{
    return this.http.get(this.apiUrl + 'productos')
  }

  
  
}

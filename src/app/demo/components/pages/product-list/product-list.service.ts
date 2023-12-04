import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product-list.model';

@Injectable()
  export class ProductService {
    private apiUrl = 'http://localhost:3000/api'; // URL de API
  
    constructor(private http: HttpClient) {}

    getListProducts(): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos`)    
    }

    getProduct(id:string): Observable<Product>{
      return this.http.get<Product>(`${this.apiUrl}/productos/${id}`)
    }
    
    getProductosPorCategoria(categoria: string): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos-categoria/${categoria}`)
    }
  }
  
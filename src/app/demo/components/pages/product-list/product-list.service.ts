import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product-list.model';

@Injectable()
  export class ProductService {

    private productosCarrito: Product [];
    private _products: BehaviorSubject<Product[]> ;



    private apiUrl = 'http://localhost:3000/api'; // URL de API
  
    constructor(private http: HttpClient) {
      this._products = new BehaviorSubject<Product[]>([]);
    }

    getListProducts(): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos`)    
    }

    getProduct(id:string): Observable<Product>{
      return this.http.get<Product>(`${this.apiUrl}/productos/${id}`)
    }
    
    getProductosPorCategoria(categoria: string): Observable<Product[]>{
      return this.http.get<Product[]>(`${this.apiUrl}/productos-categoria/${categoria}`)
    }


    get products(){
      return this._products.asObservable();
    }

    agregarNuevoProducto(producto: Product) {
      this.productosCarrito.push(producto);
      this._products.next(this.productosCarrito)
    }
  }
  
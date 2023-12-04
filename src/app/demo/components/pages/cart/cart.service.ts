import { Injectable } from '@angular/core';
import { Producto } from '../productos/producto.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartProducts: Producto [] =[];

  //añadir un producto al carrito
  private _products: BehaviorSubject<Producto[]>

  constructor() { 
    this._products = new BehaviorSubject<Producto[]>([]);
  }

  //Metodo de poder realizar una subcripcion y recuperar los valores
  get products(){
    return this._products.asObservable();
  }

  //Agregar al carrito de compras cuando pulse el botón dentro de la card de producto
  addNewProduct(product: Producto){
    this.cartProducts.push(product);
    this._products.next(this.cartProducts);
  }

  deleteProduct(index: number) {
    if (index >= 0 && index < this.cartProducts.length) {
      this.cartProducts.splice(index, 1);
      this._products.next(this.cartProducts);
    }
  }
}

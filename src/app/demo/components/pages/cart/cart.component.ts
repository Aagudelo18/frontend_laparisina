import { Component } from '@angular/core';
import { Producto } from '../productos/producto.model';
import { CartService } from './cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  products: Producto[] = [];
  

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(){
    this.cartService.products.subscribe(products =>{
      this.products = products;
    })
  }

  onClickDelete(indice: number){
    this.cartService.deleteProduct(indice)
  }
}

import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss']
})
export class TotalComponent {

  total: number = 0

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.products
    .pipe(map(product => {
      //suma de los precios
      return product.reduce((prev, curr)=> prev + curr.precio_ico, 0)
    }))
    //Se recibe un valor, que es el resultado de la operacion de pipe
    .subscribe(valor => {
      this.total = valor;
    })
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { TotalComponent } from '../total/total.component';



@NgModule({
  
  imports: [
    CommonModule,
    CartRoutingModule,
  ],

  declarations: [
  ],
 
})
export class CartModule { }
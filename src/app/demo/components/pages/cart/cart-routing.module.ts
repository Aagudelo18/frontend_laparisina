import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component'; 


const routes: Routes = []; 

  @NgModule({
    imports: [RouterModule.forChild([
      { path: '', component: CartComponent }
    ])],
    exports: [RouterModule]
  })
export class CartRoutingModule { }

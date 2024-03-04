import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoListComponent } from './pedido-list.component';



@NgModule({
  
  imports: [ RouterModule.forChild([
    
    { path: '', component : PedidoListComponent}
  ])],
  exports: [RouterModule]
})
export class PedidoListRoutingModule { }

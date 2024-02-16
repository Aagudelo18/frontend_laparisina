import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoClienteComponent } from './pedido-cliente.component';



@NgModule({
  
  imports: [RouterModule.forChild([
    { path: '', component : PedidoClienteComponent}
  ])],
  exports: [RouterModule]
})
export class PedidoClienteRoutingModule { }

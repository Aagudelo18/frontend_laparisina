import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoListComponent } from './pedido-list.component';
import { PedidoListRoutingModule } from './pedido-list-routing.module';
import { PedidoListService } from './pedido-list.service';





@NgModule({
 
  imports: [
    CommonModule,
    PedidoListRoutingModule,
    
  ],
  declarations: [
    PedidoListComponent],
    providers: [
      PedidoListService,
    ]
})
export class PedidoListModule { }

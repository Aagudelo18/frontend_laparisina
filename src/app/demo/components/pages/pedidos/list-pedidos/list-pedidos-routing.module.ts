import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPedidosComponent } from './list-pedidos.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: ListPedidosComponent
    },
  ])],
  exports: [RouterModule]
})
export class ListPedidosRoutingModule { }

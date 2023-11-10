import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPedidosComponent } from './new-pedidos/new-pedidos.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'pedidos', loadChildren:() => import('./list-pedidos/list-pedidos.module').then(m =>m.ListPedidosModule),   
    }
  ])],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }

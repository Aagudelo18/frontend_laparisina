import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPedidosComponent } from './new-pedidos.component';

const routes: Routes = [];

@NgModule({
  
  imports: [RouterModule.forChild([
    {
      path: '', component: NewPedidosComponent
    }
  ])],
  exports: [RouterModule]
})
export class NewPedidosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasModule } from './ventas.module';
import { VentasComponent } from './ventas.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: VentasComponent
    },
  ])],
  exports: [RouterModule]
})
export class VentasRoutingModule { }

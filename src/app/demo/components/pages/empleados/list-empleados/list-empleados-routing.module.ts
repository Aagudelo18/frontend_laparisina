import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEmpleadosModule } from './list-empleados.module';
import { ListEmpleadosComponent } from './list-empleados.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', component: ListEmpleadosComponent,
    },
  ])],
  exports: [RouterModule]
})
export class ListEmpleadosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEmpleadosComponent } from './new-empleados.component';

const routes: Routes = [];

@NgModule({
  
  imports: [RouterModule.forChild([
    {
      path: '', component: NewEmpleadosComponent
    }
  ])],
  exports: [RouterModule]
})
export class NewEmpleadosRoutingModule { }

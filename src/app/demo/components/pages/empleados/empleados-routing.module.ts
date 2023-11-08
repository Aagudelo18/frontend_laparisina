import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpleadosComponent } from './empleados.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EmpleadosComponent }
	])],
	exports: [RouterModule]
})
export class EmpleadosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { clientesComponent } from './clientes.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: clientesComponent }
	])],
	exports: [RouterModule] 
})
export class ClientesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { inicioComponent } from './inicio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: inicioComponent }
	])],
	exports: [RouterModule] 
})
export class InicioRoutingModule { }
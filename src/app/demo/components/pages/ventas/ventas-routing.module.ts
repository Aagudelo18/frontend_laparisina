import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VentasComponent } from './ventas.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: VentasComponent }
	])],
	exports: [RouterModule]
})
export class VentasRoutingModule { }

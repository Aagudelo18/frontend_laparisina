import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransportesComponent } from './transportes.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TransportesComponent }
	])],
	exports: [RouterModule]
})
export class TransportesRoutingModule { }
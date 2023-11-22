import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdenDeProduccionComponent } from './ordenP.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrdenDeProduccionComponent }
	])],
	exports: [RouterModule]
})
export class OrdenDeProduccionRoutingModule { }

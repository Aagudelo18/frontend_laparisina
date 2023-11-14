import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductoComponent } from './producto.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProductoComponent }
	])],
	exports: [RouterModule]
})
export class ProductoRoutingModule { }

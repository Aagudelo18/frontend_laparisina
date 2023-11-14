import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriaPComponent } from './categoriaP.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CategoriaPComponent }
	])],
	exports: [RouterModule]
})
export class CategoriaPRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestaurarContrasenaComponent } from './restaurar-contrasena.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RestaurarContrasenaComponent }
    ])],
    exports: [RouterModule]
})
export class RestaurarContrasenaRoutingModule { }
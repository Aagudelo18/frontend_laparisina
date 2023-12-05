import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RecuperarContrasenaComponent }
    ])],
    exports: [RouterModule]
})
export class RecuperarContrasenaRoutingModule { }
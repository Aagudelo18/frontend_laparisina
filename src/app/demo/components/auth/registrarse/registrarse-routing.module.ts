import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrarseComponent } from './registrarse.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RegistrarseComponent }
    ])],
    exports: [RouterModule]
})
export class RegistrarseRoutingModule { }

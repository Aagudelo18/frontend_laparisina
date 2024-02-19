import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurarContrasenaRoutingModule } from './restaurar-contrasena-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RestaurarContrasenaComponent } from './restaurar-contrasena.component';

@NgModule({
    imports: [
        CommonModule,
        RestaurarContrasenaRoutingModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ToastModule
    ],
    declarations: [RestaurarContrasenaComponent]
})
export class RestaurarContrasenaModule { }

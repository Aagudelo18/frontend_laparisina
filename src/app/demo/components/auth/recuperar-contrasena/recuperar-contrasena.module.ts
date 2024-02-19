import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecuperarContrasenaRoutingModule } from './recuperar-contrasena-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';

@NgModule({
    imports: [
        CommonModule,
        RecuperarContrasenaRoutingModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ToastModule
    ],
    declarations: [RecuperarContrasenaComponent]
})
export class RecuperarContrasenaModule { }

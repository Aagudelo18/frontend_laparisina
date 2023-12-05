import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarseRoutingModule } from './registrarse-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RegistrarseComponent } from './registrarse.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        CommonModule,
        RegistrarseRoutingModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DropdownModule,
        DialogModule
    ],
    declarations: [RegistrarseComponent]
})
export class RegistrarseModule { }

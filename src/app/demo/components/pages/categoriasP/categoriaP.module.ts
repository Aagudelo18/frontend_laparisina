import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaPRoutingModule } from './categoriaP-routing.module';
import { CategoriaPComponent } from './categoriaP.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CategoriaPService } from './categoriaP.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule } from "primeng/autocomplete";
import { HttpClientModule } from '@angular/common/http'



@NgModule({
    imports: [
        CommonModule,
        CategoriaPRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ReactiveFormsModule,
        InputSwitchModule,
        AutoCompleteModule,
        HttpClientModule
    ],
    declarations: [CategoriaPComponent],
    providers: [
        CategoriaPService // Agrega tu servicio como un proveedor aquí
      ]
})
export class CategoriaPModule { }

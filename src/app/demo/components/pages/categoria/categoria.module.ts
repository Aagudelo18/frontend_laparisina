import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaComponent } from './categoria.component';
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
import { CategoriaService } from './categoria.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
    imports: [
        CommonModule,
        CategoriaRoutingModule,
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
        ImageModule,
        TooltipModule
    ],
    declarations: [CategoriaComponent],
    providers: [
        CategoriaService // Agrega tu servicio como un proveedor aquí
      ]
})
export class CategoriaModule { }

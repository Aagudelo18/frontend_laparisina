import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoRoutingModule } from './product-list-routing.module';
import { ProductComponent } from './product-list.component';
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
import { ProductService } from './product-list.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
    imports: [
        CommonModule,
        ProductoRoutingModule,
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
        GalleriaModule,
        CarouselModule,
        DataViewModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [ProductComponent],
    providers: [
        ProductService // Agrega tu servicio como un proveedor aquí
      ]
})
export class ProductModule { }

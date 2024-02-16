import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule y ReactiveFormsModule
import { PedidoClienteRoutingModule } from './pedido-cliente-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DataViewModule } from 'primeng/dataview';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';

// Importa el componente PedidoCliente
import { PedidoClienteComponent } from './pedido-cliente.component';

// Importa el servicio PedidoClienteService
import { PedidoClienteService } from './pedido-cliente.service';

@NgModule({
    imports: [
        CommonModule,
        PedidoClienteRoutingModule,
        FormsModule,  // Importa FormsModule
        ReactiveFormsModule,  // Importa ReactiveFormsModule
        AutoCompleteModule,
        CalendarModule,
        ChipsModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule,
        MultiSelectModule,
        InputTextareaModule,
        InputTextModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        ToggleButtonModule,
        RippleModule,
        ProgressBarModule,
        ToastModule,
        DataViewModule,
        MenubarModule,
        OverlayPanelModule,
        FileUploadModule,
        DialogModule,
        ImageModule,
        GalleriaModule,
        InputSwitchModule,
        RadioButtonModule,
        ToolbarModule
    ],
    declarations: [PedidoClienteComponent],
    providers: [
        PedidoClienteService, // Agrega tu servicio como un proveedor aquí
    ],
})
export class PedidoClienteModule {}

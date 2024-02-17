import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoListComponent } from './pedido-list.component';
import { PedidoListRoutingModule } from './pedido-list-routing.module';
import { PedidoListService } from './pedido-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
 
  imports: [
    CommonModule,
    PedidoListRoutingModule,
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
    TabViewModule,
    TooltipModule,
  ],
  declarations: [
    PedidoListComponent],
    providers: [
      PedidoListService,
    ]
})
export class PedidoListModule { }

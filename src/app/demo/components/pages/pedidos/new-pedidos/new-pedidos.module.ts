import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPedidosRoutingModule } from './new-pedidos-routing.module';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloatlabelDemoRoutingModule } from '../../../uikit/floatlabel/floatlabeldemo-routing.module';
import { NewPedidosComponent } from './new-pedidos.component';


@NgModule({
 
  imports: [
    CommonModule,
    NewPedidosRoutingModule,
	FormsModule,
	FloatlabelDemoRoutingModule,
	AutoCompleteModule,
	CalendarModule,
	ChipsModule,
	DropdownModule,
	InputMaskModule,
	InputNumberModule,
	CascadeSelectModule,
	MultiSelectModule,
	InputTextareaModule,
	InputTextModule
  ],
  declarations: [NewPedidosComponent],
})
export class NewPedidosModule { }

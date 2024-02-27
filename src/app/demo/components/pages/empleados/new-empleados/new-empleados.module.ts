import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEmpleadosRoutingModule } from './new-empleados-routing.module';
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
import { NewEmpleadosComponent } from './new-empleados.component';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
 
  imports: [
    CommonModule,
    NewEmpleadosRoutingModule,
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
	InputTextModule,
	TableModule,
	RatingModule,
	ButtonModule,
	SliderModule,
	ToggleButtonModule,
	RippleModule,
	ProgressBarModule,
	ToastModule,
	DialogModule,
	ReactiveFormsModule,
  ],
  declarations: [NewEmpleadosComponent],
})
export class NewEmpleadosModule { }
export class TuModule { }

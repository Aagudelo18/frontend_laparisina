import { Component, OnInit } from '@angular/core';
import { TransportesService } from './transportes.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Transportes } from './transportes.model';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subject,Observable, throwError   } from 'rxjs';
import { NgModule } from '@angular/core';

@Component({
  templateUrl: './transportes.component.html', 
  providers: [MessageService]
})
export class TransportesComponent implements OnInit {
    crearTransportesDialog: boolean = false;
    editarTransportesDialog: boolean = false;
    estadoTransportesDialog: boolean = false;
    selectedTranspotes: any[] = [];

    listTransportes: Transportes[] = []
    transportes: Transportes = {}
    formTransportes:FormGroup;
    id: string = '';

    estado:SelectItem[] = [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false }
    ];
    selectedEstado: SelectItem = {value: ''};

    constructor(private fb:FormBuilder,
      private transportesService: TransportesService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute){
        this.formTransportes = this.fb.group({
          ciudad_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{3,30}$/),]],
          precio_transporte: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
          estado_transporte: ['',],
        })
        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
       }
  
    ngOnInit():void {        
        this.getListTransportes();
        console.log('transportes:', this.transportes);                  
    }

    getListTransportes(){     
        this.transportesService.getListTransportes().subscribe((data) =>{      
          this.listTransportes = data;        
        })        
    } 
    getTransporte(id:string){      
      this.transportesService.getTransportes(id).subscribe((data:Transportes) => {
       
        this.formTransportes.setValue({
          ciudad_cliente: data.ciudad_cliente,
          precio_transporte:data.precio_transporte,
          estado_transporte:data.estado_transporte,
        })
      })
    }

     // Función para crear un transporte
     crearTransporte() {
      console.log('Valor de ciudad_cliente:', this.formTransportes.value.ciudad_cliente);
      console.log('Valor de precio_transporte:', this.formTransportes.value.precio_transporte);
      const ciudad = this.formTransportes.value.ciudad_cliente;

      const ciudadExistente = this.listTransportes.find(transporte => transporte.ciudad_cliente  === ciudad);
      if (ciudadExistente) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear nuevo transporte',
          detail: 'El municipio ya existe.',
          life: 6000
        });
        return; // Detener la ejecución de la función si numero de identificacion ya existe
      }
      const nuevoTransporte: Transportes = {
        ciudad_cliente: this.formTransportes.value.ciudad_cliente,
        precio_transporte:this.formTransportes.value.precio_transporte,
        estado_transporte: true,
    };

      this.transportesService.postTransportes(nuevoTransporte).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'El Transporte fue creado con éxito',
          detail: 'Transporte creado',
          life: 6000,
        });
        this.getListTransportes();
        this.crearTransportesDialog = false;
      },
      (error) => {
        console.error('Error al crear el Transporte:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear el Transporte',
          detail: 'Error al crear el Transporte',
          life: 3000,
        });
      }
    );
    }

    actualizarTransporte() {
      const ciudad = this.formTransportes.value.ciudad_cliente;

      const ciudadExistente = this.listTransportes.find(transporte => transporte.ciudad_cliente  === ciudad);
      if (ciudadExistente && ciudadExistente._id !== this.id) { // Evitar comparar el mismo municipio consigo mismo
        this.messageService.add({
          severity: 'error',
          summary: 'Error al editar el Transporte',
          detail: 'El municipio ya está en uso.',
          life: 6000
        });
        return; // Detener la ejecución de la función si el nuevo  ya existe
      }
      const transporteActualizado: Transportes = {
        ciudad_cliente: this.formTransportes.value.ciudad_cliente,
        precio_transporte:this.formTransportes.value.precio_transporte,
        estado_transporte: true,
    };
    if (this.id !== '') {
      transporteActualizado._id = this.id;
      this.transportesService.putTransportes(this.id, transporteActualizado).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'El transporte fue actualizado con éxito',
          detail: 'Transporte actualizado',
          life: 6000
        });
        this.getListTransportes();
        this.editarTransportesDialog = false;
      });
    }
  }

   // Función para confirmar cambiar el estado de un transporte
   confirmarCambioEstado(transportes: Transportes) {
    this.estadoTransportesDialog = true;
    this.transportes = transportes
  }
  
   //Función para no cambiar el estado de un transporte
   noCambiarEstado() {
    this.estadoTransportesDialog = false;
    this.getListTransportes();
  }
  // Función para cambiar el estado de un transporte
  cambiarEstadoTransporte(id: string) {
    this.transportesService.actualizarEstadoTransportes(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'El estado del transporte fue cambiado con éxito',
          life: 3000
        });
        this.estadoTransportesDialog = false;
      },
      error: (error) => {
        console.error('Error cambiando el estado del transporte:', error);
        // Manejar errores según sea necesario
      }
    });
  }

  openNewTransporteDialog() {
    this.id = '';                
    this.formTransportes.reset()
    this.crearTransportesDialog = true;
  }

  openEditarTransporteDialog(id:string) {
      this.id = id;
      this.editarTransportesDialog = true;
      this.getTransporte(id);
  }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
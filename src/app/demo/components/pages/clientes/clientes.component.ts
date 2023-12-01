import { Component, OnInit } from '@angular/core';
import { ClienteService } from './clientes.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from './clientes.model';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
 
@Component({
    templateUrl: './clientes.component.html',
    providers: [MessageService]
})
export class clientesComponent implements OnInit {
    crearClienteDialog: boolean = false;
    editarClienteaDialog: boolean = false;
    detalleClienteDialog: boolean =false;
    estadoClienteDialog: boolean = false;
    selectedClientes: any[] = [];
   
    
    
      listClientes: Clientes[] = []
      clientes: Clientes = {}
      formCliente:FormGroup;
      id: string = '';
      
  
      estado:SelectItem[] = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
      ];
  
      selectedEstado: SelectItem = {value: ''};
  
  
  
      constructor(private fb:FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private router:Router,
        private aRouter:ActivatedRoute){
          this.formCliente = this.fb.group({
            tipo_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            nombre_contacto: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            nombre_juridico: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            numero_documento_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
            nit_empresa_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,12}$/),]],
            correo_cliente: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),]],
            telefono_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
            direccion_cliente: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9\s,.'-]+$/),]],
            barrio_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            ciudad_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            estado_cliente: ['', Validators.required],
  
          })
          this.aRouter.params.subscribe(params => {
            this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
          });
         }
  
      ngOnInit():void {        
          this.getListClientes();
          console.log('clientes:', this.clientes);                  
      }
  
      getListClientes(){     
          this.clienteService.getListClientes().subscribe((data) =>{      
            this.listClientes = data;        
          })        
      } 
  
      getClientes(id:string){      
        this.clienteService.getClientes(id).subscribe((data:Clientes) => {

          const nombreJuridico = data.nombre_juridico !== undefined ? data.nombre_juridico : '';
          const nitEmpresa = data.nit_empresa_cliente !== undefined ? data.nit_empresa_cliente : '';
          console.log(`nombreJuridico: ${nombreJuridico} \n nitEmpresa:${nitEmpresa}`)
         
          this.formCliente.setValue({
            tipo_cliente: data.tipo_cliente,
            nombre_contacto: data.nombre_contacto,
            nombre_juridico:nombreJuridico ,
            numero_documento_cliente: data.numero_documento_cliente,
            nit_empresa_cliente: nitEmpresa,
            correo_cliente: data.correo_cliente,
            telefono_cliente: data.telefono_cliente,
            direccion_cliente: data.direccion_cliente,
            barrio_cliente: data.barrio_cliente,
            ciudad_cliente: data.ciudad_cliente,
            estado_cliente:data.estado_cliente,
          })
        })
      }
  
      // Función para crear una categoría
      crearCliente() {
        const nuevoCliente: Clientes = {
            tipo_cliente: this.formCliente.value.tipo_cliente,
            nombre_contacto: this.formCliente.value.nombre_contacto,
            nombre_juridico: this.formCliente.value.nombre_juridico,
            numero_documento_cliente: this.formCliente.value.numero_documento_cliente,
            nit_empresa_cliente: this.formCliente.value.nit_empresa_cliente,
            correo_cliente: this.formCliente.value.correo_cliente,
            telefono_cliente: this.formCliente.value.telefono_cliente,
            direccion_cliente: this.formCliente.value.direccion_cliente,
            barrio_cliente: this.formCliente.value.barrio_cliente,
            ciudad_cliente: this.formCliente.value.ciudad_cliente,
            estado_cliente: true,
        };
  
        this.clienteService.postClientes(nuevoCliente).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'El cliente fue creado con éxito',
            detail: 'Cliente creado',
            life: 6000
          });
          this.getListClientes();
          this.crearClienteDialog = false;
        });
      }
  
      // Función para actualizar una categoría
      actualizarCliente() {
        const clienteActualizado: Clientes = {
            tipo_cliente: this.formCliente.value.tipo_cliente,
            nombre_contacto: this.formCliente.value.nombre_contacto,
            nombre_juridico: this.formCliente.value.nombre_juridico,
            numero_documento_cliente: this.formCliente.value.numero_documento_cliente,
            nit_empresa_cliente: this.formCliente.value.nit_empresa_cliente,
            correo_cliente: this.formCliente.value.correo_cliente,
            telefono_cliente: this.formCliente.value.telefono_cliente,
            direccion_cliente: this.formCliente.value.direccion_cliente,
            barrio_cliente: this.formCliente.value.barrio_cliente,
            ciudad_cliente: this.formCliente.value.ciudad_cliente,
            estado_cliente: this.formCliente.value.estado_cliente,
        };
  
        if (this.id !== '') {
          clienteActualizado._id = this.id;
          this.clienteService.putClientes(this.id, clienteActualizado).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'El cliente fue actualizado con éxito',
              detail: 'Cliente actualizado',
              life: 6000
            });
            this.getListClientes();
            this.editarClienteaDialog = false;
          });
        }
      }


      // Función para confirmar cambiar el estado de un cliente
    confirmarCambioEstado(clientes: Clientes) {
      this.estadoClienteDialog = true;
      this.clientes = clientes
    }
    
     //Función para no cambiar el estado de un cliente
     noCambiarEstado() {
      this.estadoClienteDialog = false;
      this.getListClientes();
    }
    // Función para cambiar el estado de un cliente
    cambiarEstadoCliente(id: string) {
      this.clienteService.actualizarEstadoCliente(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'El estado del cliente fue cambiado con éxito',
            life: 3000
          });
          this.estadoClienteDialog = false;
          // Actualizar la lista de categorías u otra lógica según sea necesario
        },
        error: (error) => {
          console.error('Error cambiando el estado del cliente:', error);
          // Manejar errores según sea necesario
        }
      });
    }
  
  
      openNewClienteDialog() {
          this.id = '';                
          this.formCliente.reset()
          this.crearClienteDialog = true;
      }
      
      openEditarClienteDialog(id:string) {
          this.id = id;
          this.editarClienteaDialog = true;
          this.getClientes(id);
      }

      openDetalleClienteDialog(id:string) {
        this.id = id;
        this.detalleClienteDialog = true;
        this.getClientes(id);
    }
  
      onGlobalFilter(table: Table, event: Event) {
          table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

}
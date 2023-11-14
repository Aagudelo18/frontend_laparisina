import { Component, OnInit } from '@angular/core';
import { ClienteService } from './clientes.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
 
@Component({
    templateUrl: './clientes.component.html',
    providers: [ClienteService, MessageService]
})
export class clientesComponent implements OnInit {
    clientes: any[] = [];
    selectedClientes: any[] = [];
    nuevoCliente: any = {
      codigo_cliente: '',
      tipo_cliente: null,
      nombre_contacto: '',
      nombre_juridico:'',
      numero_documento_cliente:'',
      nit_empresa_cliente:'',
      correo_cliente:'',
      celular_cliente:'',
      direccion_cliente:'',
      barrio_cliente:'',
      ciudad_cliente:'',
      estado_cliente:true
    };
  
    crearClienteDialog: boolean = false;
    openNewClienteDialog() {
        this.crearClienteDialog = true;
      }

    editarClienteaDialog: boolean = false;
    openEditarClienteDialog() {
        this.editarClienteaDialog = true;
      }
    
    constructor(private clientesService:ClienteService, private route: ActivatedRoute) { }
      
     ngOnInit() {
       this.clientesService.getClientes().subscribe((data: any[]) => {
        this.clientes = data;
       });
     }
    // ngOnInit(): void {
    //   // Obtiene los parámetros de la URL, incluido el ID del cliente
    //   this.route.params.subscribe((params) => {
    //     const clienteId = params['id']; // 'id' debe coincidir con el nombre del parámetro definido en tus rutas
    
    //     // Ahora, puedes usar clienteId para cargar los detalles del cliente desde tu servicio
    //     this.clientesService.getClientePorId(clienteId).subscribe((cliente) => {
    //       this.clientes = cliente; // Asigna los detalles del cliente al objeto 'cliente'
    //     });
    //   });
    // }

    // Función para actualizar la lista de empleados después de crear uno nuevo
    actualizarListaClientes() {
      this.clientesService.getClientes().subscribe((data) => {
          this.clientes = data;
      });
    }
    guardarCliente() {
      // Llama al servicio para crear el cliente
      this.clientesService.agregarCliente(this.nuevoCliente).subscribe(
        (response) => {
          console.log('Cliente creado con éxito:', response);
          // Puedes redirigir a una página diferente o mostrar un mensaje de éxito aquí
          //this.nuevoCliente = {}; // Restablece el nuevo cliente después de la creación
          this.actualizarListaClientes();
                this.crearClienteDialog = false; // Retraso de 1 segundo (ajusta según sea necesario)

        },
        (error) => {
          console.error('Error al crear el cliente:', error);
          // Maneja el error apropiadamente, muestra un mensaje de error, etc.
        }
      );
  }
}
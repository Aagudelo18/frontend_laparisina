import { Component, OnInit } from '@angular/core';
import { PedidosService } from './pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './pedidos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.component.html',
  styleUrls: ['./list-pedidos.component.scss'],
  providers: [MessageService, ConfirmationService],
})



export class ListPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  selectedPedidos: Pedido[] = [];
  detallePedidoDialog: boolean = false;
  selectedPedidoId: string;
  pedido: any = {};
  id: string = '';
  formPedidos: FormGroup;
  roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  estadoSiguiente: string;
 

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) 
    {
      this.formPedidos = this.fb.group({
        documento_cliente: [''],
        tipo_cliente: [''],
        nombre_contacto: [''],
        telefono_cliente: [''],
        quien_recibe:[''],
        ciudad_cliente:[''],
        barrio_cliente:[''],
        fecha_entrega_pedido:[''],
        fecha_pedido_tomado:[''],
        direccion_entrega:[''],
        estado_pedido: [''],
        precio_total_venta:[''],
        subtotal_venta:[''],
        metodo_pago:[''],
        valor_domicilio:[''],
        nit_empresa_cliente:[''],
        nombre_juridico:[''],
        aumento_empresa:[''],
        detalle_pedido:['']
      
      }); 
     }

    ngOnInit() {
      this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
        this.pedidos = data;
      });

    }

  openNewPedidos() {
    this.router.navigate(['/new-pedidos'])
  }

  enviarListPedido(){
    this.router.navigate(['/list-pedidos']);
  }

  verDetallePedido(id: string) {
    this.id = id;
    this.detallePedidoDialog = true;
    this.getPedidoDetalle(id);
  }


  getPedidoDetalle(id: string){
    this.pedidosService.getPedidoDetalle(id).subscribe((data)=>{
      this.formPedidos.setValue({
        documento_cliente: data.documento_cliente,
        tipo_cliente: data.tipo_cliente,
        nombre_contacto: data.nombre_contacto,
        telefono_cliente: data.telefono_cliente,
        quien_recibe: data.quien_recibe,
        direccion_entrega: data.direccion_entrega,
        barrio_cliente: data.barrio_cliente,
        fecha_entrega_pedido: data.fecha_entrega_pedido,
        fecha_pedido_tomado: data.fecha_pedido_tomado,
        ciudad_cliente: data.ciudad_cliente,
        estado_pedido: data.estado_pedido,
        precio_total_venta: data.precio_total_venta,
        subtotal_venta: data.subtotal_venta,
        metodo_pago: data.metodo_pago,
        valor_domicilio: data.valor_domicilio,
        aumento_empresa: data.aumento_empresa || '',
        nit_empresa_cliente: data.nit_empresa_cliente || '',
        nombre_juridico: data.nombre_juridico || '',
        detalle_pedido: data.detalle_pedido || []     
      }) 
    })}
    
    esPersonaNatural() {
      return this.formPedidos.get('tipo_cliente').value === 'Persona natura';
   }
   
   esEmpresa() {
      return this.formPedidos.get('tipo_cliente').value === 'Empresa';
   }
   

    
   cambiarEstadoPedido(pedido: Pedido, nuevoEstado: string) {
    // Validación: Solo permitir cambiar de 'Pendiente' a 'Tomado'
    if (pedido.estado_pedido === 'Pendiente' && nuevoEstado === 'Tomado') {
      // Actualizar el estado del pedido
      this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
        () => {
          console.log(`Estado del pedido con ID ${pedido._id} actualizado a 'Tomado'.`);
          // Actualizar la lista de pedidos después de la actualización
          this.cargarPedidos();
        },
        (error) => {
          console.error('Error al actualizar el estado del pedido:', error);
          // Manejar el error según tus necesidades
        }
      );
    } else {
      console.warn(`No se puede cambiar el estado del pedido con ID ${pedido._id}.`);
      // Puedes mostrar un mensaje al usuario indicando que no se puede cambiar el estado
    }

   
  }


  cambiarPedido(id: string) {
    const pedido = this.pedidos.find((pedido) => pedido._id === id);
  
    // Si el pedido está en el estado "Pendiente", establece el estado siguiente
    if (pedido.estado_pedido === 'Pendiente') {
      pedido.estado_pedido = 'Tomado';
    }
    else {
      pedido.estado_pedido = pedido.estado_pedido;
    }
  
    // Pasa el pedido al método updatePedido()
    this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cambio de estado con Éxito',
          life: 5000
        }); 
        // Actualizar la lista de pedidos
        this.cargarPedidos();
      },
      (error) => {
        if (error.error && error.error.error) {
          const errorMessage = error.error.error;
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cambiar el estado del Pedido',
            detail: errorMessage,
            life: 5000
          });
        } else {
          console.error('Error desconocido al crear el Pedido:', error);
        }
      }
    );
  }


  cargarPedidos() {
    this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
   
}



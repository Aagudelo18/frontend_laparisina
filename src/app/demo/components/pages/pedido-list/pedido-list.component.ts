import { Component, OnInit } from '@angular/core';
import { PedidoListService } from './pedido-list.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { Cliente } from './pedido-model';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.scss'],
  providers: [MessageService, ConfirmationService],

})
export class PedidoListComponent implements OnInit {
  clientes: Cliente[] = [];
  pedidosCliente: Cliente[] = [];
  formPedidos: FormGroup;
  resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
  cambiarEstadoPDialogAnular: boolean;
  detallePedidoDialog: boolean = false;
  id: string = '';
  

constructor(
  private pedidoListService: PedidoListService,
  private messageService: MessageService,
  private confirmationService: ConfirmationService,
  private router: Router, 
  private fb: FormBuilder,
  ) {
    this.formPedidos = this.fb.group({
      documento_cliente: [''],
      tipo_cliente: [''],
      nombre_contacto: [''],
      telefono_cliente: [''],
      quien_recibe: [''],
      ciudad_cliente: [''],
      barrio_cliente: [''],
      fecha_entrega_pedido: [''],
      fecha_pedido_tomado: [''],
      direccion_entrega: [''],
      estado_pedido: [''],
      precio_total_venta: [''],
      subtotal_venta: [''],
      metodo_pago: [''],
      estado_pago: [''],
      valor_domicilio: [''],
      nit_empresa_cliente: [''],
      nombre_juridico: [''],
      aumento_empresa: [''],
      detalle_pedido: [''],
      domiciliario: [''],
  });
  }

 
  ngOnInit() {

  this.cargarPedidosCliente();
  
  }


  cargarPedidosCliente() {
    this.pedidoListService
        .getTodosPedido(localStorage.getItem('documento_cliente'))
        .subscribe((data: Cliente[]) => {
            this.pedidosCliente = data;
            console.log(this.pedidosCliente);
        });
}



cambiarPedidoAnular(id: string) {
  const pedido = this.pedidosCliente.find((pedido) => pedido._id === id);
  console.log(pedido);
  pedido.estado_pedido = 'Anulado';
  // Pasa el pedido al método updatePedido()
  this.pedidoListService.updatePedido(pedido._id, pedido).subscribe(
      (response) => {
          this.messageService.add({
              severity: 'success',
              summary: 'Cambio de estado con Éxito',
              life: 5000,
          });
          // Actualizar la lista de pedidos
          this.cargarPedidosCliente();
         
      },
      (error) => {
          if (error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error al cambiar el estado del Pedido',
                  detail: errorMessage,
                  life: 5000,
              });
          } else {
              console.error(
                  'Error desconocido al crear el Pedido:',
                  error
              );
          }
      }
  );
  this.cambiarEstadoPDialogAnular = false;
}

  // Actualiza el método para manejar el botón "Sí"
  onYesButtonClickAnular() {
    this.resolverPromesa(true); // Resuelve la promesa con "true"
    this.cambiarEstadoPDialogAnular = false; // Esto cerrará el diálogo automáticamente
}

// Actualiza el método para manejar el botón "No"
onNoButtonClickAnular() {
    this.resolverPromesa(false); // Resuelve la promesa con "false"
    this.cambiarEstadoPDialogAnular = false; // Esto cerrará el diálogo automáticamente
}

    // Añade la lógica para abrir el diálogo
    async abrirModalAnular(id: string) {
      this.cambiarEstadoPDialogAnular = true;

      // Espera hasta que se resuelva la promesa
      const respuesta = await this.esperarRespuesta();

      // Ahora puedes usar la respuesta como necesites
      if (respuesta) {
          this.cambiarPedidoAnular(id);
      } else {
          // Lógica si la respuesta es "No"
      }
  }

  private esperarRespuesta(): Promise<boolean> {
    return new Promise<boolean>((resolver) => {
        this.resolverPromesa = resolver;
    });
}

verDetallePedidoCliente(id: string) {
  this.id = id;
  this.detallePedidoDialog = true;
  this.getPedidoDetalleCliente(id);
}

getPedidoDetalleCliente(id: string) {
  this.pedidoListService.getPedidoDetalle(id).subscribe((data) => {
      let aumento = data.subtotal_venta * 0.08;
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
          estado_pago: data.estado_pago,
          valor_domicilio: data.valor_domicilio,
          aumento_empresa: aumento || '',
          nit_empresa_cliente: data.nit_empresa_cliente || '',
          nombre_juridico: data.nombre_juridico || '',
          detalle_pedido: data.detalle_pedido || [],
          domiciliario: '',
      });
      
  });
}


}

import { Component, OnInit } from '@angular/core';
import { PedidosService } from './pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './pedidos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.component.html',
  styleUrls: ['./list-pedidos.component.scss']
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
  estadoPedidoDialog: boolean = false;
  estadosPedido: SelectItem[]; // Variable para almacenar los estados del pedido
  estadoSeleccionado: string; // Variable para almacenar el estado seleccionado en el dropdown


  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private fb: FormBuilder,
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

      this.estadosPedido = [
        { label: 'Tomado', value: 'Tomado' },
        { label: 'Preparacion', value: 'Preparacion' },
        { label: 'Terminado', value: 'Terminado' },
        { label: 'Asignado', value: 'Asignado' },
        { label: 'Enviado', value: 'Enviado' },
        { label: 'Entregado', value: 'Entregado' },
        { label: 'Anulado', value: 'Anulado' }
    ];
    }

  openNewPedidos() {
    this.router.navigate(['/new-pedidos'])
  }

  editNewPedidos() {
    this.router.navigate(['edit-pedidos'])
  }

  verDetallePedido(id: string) {
    this.id = id;
    this.detallePedidoDialog = true;
    this.getPedidoDetalle(id);
  }

  cambiarPedido(id: string, nuevoEstado: string) {
    this.id = id;
    this.estadoPedidoDialog = true;
    this.cambiarEstadoPedido(id, nuevoEstado);
  }

  cerrarDialogEstadoPedido() {
    this.estadoPedidoDialog = false;
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

    
  cambiarEstadoPedido(id: string, nuevoEstado: string) {
    this.pedidosService.updatePedido(id, nuevoEstado).subscribe(
      () => {
        console.log(`Estado del pedido con ID ${id} actualizado con éxito.`);
        // Puedes recargar la lista de pedidos o hacer otras acciones después de la actualización
        this.cargarPedidos();
      },
      (error) => {
        console.error('Error al actualizar el estado del pedido:', error);
        // Puedes manejar el error de la manera que desees
      }
    );
    // Puedes cerrar el modal aquí si es necesario después de cambiar el estado
    this.detallePedidoDialog = false;
  }

  guardarEstadoPedido() {
    const idPedido = this.id;
    const nuevoEstado = this.estadoSeleccionado;

    this.pedidosService.updatePedido(idPedido, nuevoEstado).subscribe(
      () => {
        console.log(`Estado del pedido con ID ${idPedido} actualizado con éxito.`);
        this.cargarPedidos(); // Recarga la lista de pedidos después de la actualización
      },
      (error) => {
        console.error('Error al actualizar el estado del pedido:', error);
        // Puedes manejar el error de la manera que desees
      }
    );

    // Cierra el modal después de guardar el estado
    this.estadoPedidoDialog = false;
  }

  

  cargarPedidos() {
    this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
    });
  }
   
}



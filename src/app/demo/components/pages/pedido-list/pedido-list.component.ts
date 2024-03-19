import { Component, OnInit } from '@angular/core';
import { PedidoListService } from './pedido-list.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cliente } from './pedido-model';
import { ConfirmationService} from 'primeng/api';
import { ProductoCarrito } from '../product-list/product-list.model';
import { LayoutService } from 'src/app/layout/service/app.layout.service';




@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.scss'],
  providers: [MessageService, ConfirmationService],

})
export class PedidoListComponent implements OnInit {

  clientes: Cliente[] = [];
  cliente: any;
  tipoCliente: string;
  pedidosCliente: Cliente[] = [];
  formPedidos: FormGroup;
  resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
  cambiarEstadoPDialogAnular: boolean;
  detallePedidoDialog: boolean = false;
  id: string = '';
  localStorageService: any;
  dtPendientes: any;
     //---------------------------------------------------------------------------------------------------------------------------------
    //Variables para controlar el carrito
    productosCarrito: ProductoCarrito[] = [];
    cantidad?: number;
    cantidadSeleccionada: number = 1;
    totalCarrito: number = 0;

   
    
  
  

constructor(
  public layoutService: LayoutService, 
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
      tipo_entrega:[''],
      valor_domicilio: [''],
      nit_empresa_cliente: [''],
      nombre_juridico: [''],
      aumento_empresa: [''],
      detalle_pedido: [''],
      domiciliario: [''],
  });
  }
  

 
  ngOnInit() {
  

    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        this.obtenerDatosCliente(currentUser.correo_electronico);
        
}



getDomiciliario(id) {
  this.pedidoListService.getDomiciliariosXId(id).subscribe((data) => {
      console.log(data);
      this.formPedidos.controls['domiciliario'].setValue(
          data.nombre_empleado
      );
  });
}




  cargarPedidosCliente() {
    this.pedidoListService
        .getTodosPedido(localStorage.getItem('documento_cliente'))
        .subscribe((data: Cliente[]) => {
            this.pedidosCliente = data;
            console.log(this.pedidosCliente);
        });
}

verDetallePedidoCliente(id: string) {
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
            tipo_entrega: data.tipo_entrega,
            valor_domicilio: data.valor_domicilio,
            aumento_empresa: aumento || '',
            nit_empresa_cliente: data.nit_empresa_cliente || '',
            nombre_juridico: data.nombre_juridico || '',
            detalle_pedido: data.detalle_pedido || [],
            domiciliario: data.domiciliario ? data.domiciliario: '',
        });
        this.detallePedidoDialog = true;
        if(data.domiciliario){ 
          this.getDomiciliario(data.empleado_id);
        }

    });
}

    // Metodo para traer los datos del cliente logueado------------------------------------------------------>
    obtenerDatosCliente(correo_cliente: string): void {
      this.
          pedidoListService.obtenerClientePorCorreo(correo_cliente)
          .subscribe(
              (data: any) => {
                console.log(data)
                  this.tipoCliente = data.tipo_cliente;
                  this.cliente = data;
                  localStorage.setItem('documento_cliente', data.numero_documento_cliente);
                  this.cargarPedidosCliente();
           
              },
              (error) => {
                  console.error(error);
                  // Manejar errores según sea necesario
              }
          );
  }

}
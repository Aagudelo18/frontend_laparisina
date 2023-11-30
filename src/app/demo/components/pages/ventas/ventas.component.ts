import { Component, OnInit } from '@angular/core';
import { VentasService } from './ventas.service';
import { Router } from '@angular/router';
import { Pedido } from './ventas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  providers: [MessageService, ConfirmationService],
})



export class VentasComponent implements OnInit {
  ventas: Pedido[] = [];
  selectedVentas: Pedido[] = [];
  detalleVentaDialog: boolean = false;
  selectedVentaId: string;
  venta: any = {};
  id: string = '';
  formVentas: FormGroup;
  roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  estadoSiguiente: string;
 

  constructor(
    private ventasService: VentasService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) 
    {
      this.formVentas = this.fb.group({
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
      this.ventasService.getVentas().subscribe(
        (data: any) => {
          console.log('Datos de ventas:', data);
          this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
        },
        (error) => {
          console.error('Error al obtener los datos de ventas:', error);
          // Manejo de error: mostrar un mensaje, notificar al usuario, etc.
        }
      );
    }

  enviarListPedido(){
    this.router.navigate(['/list-pedidos']);
  }

  verDetalleVenta(id: string) {
    this.id = id;
    this.detalleVentaDialog = true;
    this.getVentaDetalle(id);
  }


  getVentaDetalle(id: string){
    this.ventasService.getVentaDetalle(id).subscribe((data)=>{
      this.formVentas.setValue({
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
      return this.formVentas.get('tipo_cliente').value === 'Persona natura';
   }
   
   esEmpresa() {
      return this.formVentas.get('tipo_cliente').value === 'Empresa';
   }

  cargarPedidos() {
    this.ventasService.getVentas().subscribe((data: Pedido[]) => {
      this.ventas = data;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
   
}



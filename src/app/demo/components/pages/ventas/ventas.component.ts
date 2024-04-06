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
  domiciliarios: any; // Puedes cargar los domiciliarios desde tu servicio


  constructor(
    private ventasService: VentasService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.formVentas = this.fb.group({
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
      tipo_entrega: [''],
    });
  }

  async descargarExcel() {
    try {
      const blob = await this.ventasService.descargarVentasExcel().toPromise();
      this.descargarArchivo(blob);
    } catch (error) {
      console.error('Error al descargar el archivo', error);
      // Manejar el error según sea necesario
    }
  }

  private descargarArchivo(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'Ventas.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  ngOnInit() {
    this.ventasService.getVentas().subscribe(
      (data: any) => {
        this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
      },
      (error) => {
        console.error('Error al obtener los datos de ventas:', error);
        // Manejo de error: mostrar un mensaje, notificar al usuario, etc.
      }
    );
    this.cargarDomiciliarios();
  }

  verDetalleVenta(id: string) {
    this.id = id;
    this.detalleVentaDialog = true;
    this.getVentaDetalle(id);
  }


  getVentaDetalle(id: string) {
    this.ventasService.getVentaDetalle(id).subscribe((data) => {
      // Formatear los valores numéricos como moneda colombiana
      let aumento = this.formatCurrency(data.subtotal_venta * 0.08);
      let precioTotalVenta = this.formatCurrency(data.precio_total_venta);
      let subtotalVenta = this.formatCurrency(data.subtotal_venta);
      let valorDomicilio = this.formatCurrency(data.valor_domicilio);
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
        precio_total_venta: precioTotalVenta,
        subtotal_venta: subtotalVenta,
        metodo_pago: data.metodo_pago,
        estado_pago: data.estado_pago,
        tipo_entrega: data.tipo_entrega,
        valor_domicilio: valorDomicilio,
        aumento_empresa: aumento || '',
        nit_empresa_cliente: data.nit_empresa_cliente || '',
        nombre_juridico: data.nombre_juridico || '',
        detalle_pedido: data.detalle_pedido || [],
        domiciliario: [],
      });
      this.getDomiciliario(data.empleado_id);
    })
  }

  getDomiciliario(id) {
    this.ventasService.getDomiciliariosXId(id).subscribe((data) => {
      this.formVentas.controls['domiciliario'].setValue(
        data.nombre_empleado
      );
    });
  }

  cargarDomiciliarios() {
    this.ventasService.getDomiciliarios().subscribe((data: any[]) => {
      this.domiciliarios = data;
    });
  }

  esPersonaNatural() {
    return this.formVentas.get('tipo_cliente').value === 'Persona natural';
  }

  esEmpresa() {
    return (
      this.formVentas.get('tipo_cliente').value === 'Persona jurídica'
    );
  }

  cargarPedidos() {
    this.ventasService.getVentas().subscribe((data: Pedido[]) => {
      this.ventas = data;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Método para formatear un valor numérico como moneda colombiana
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }

  // async descargarExcel() {
  //   try {
  //     const blob = await this.ventasService.descargarClientesExcel().toPromise();
  //     this.descargarArchivo(blob);
  //   } catch (error) {
  //     console.error('Error al descargar el archivo', error);
  //     // Manejar el error según sea necesario
  //   }
  // }

  // private descargarArchivo(blob: Blob) {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.href = url;
  //   a.download = 'ventas.xlsx';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

}



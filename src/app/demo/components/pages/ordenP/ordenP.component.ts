import { Component, OnInit } from '@angular/core';
import { OrdenDeProduccion } from './ordenP.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { OrdenDeProduccionService } from './ordenP.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
    templateUrl: './ordenP.component.html',
    providers: [MessageService]
})
export class OrdenDeProduccionComponent implements OnInit {

    listOrdenesDeProduccion: OrdenDeProduccion[] = []
    listPedidosOrden: any[] = [];
    ordenP: OrdenDeProduccion = {}
    formOrdenDeProduccion:FormGroup;
    id: string = '';

    pedido: any = {};
    pedidosSeleccionados: any[] = [];
    idsPedidosSeleccionados: any[] = [];

    nuevoEstado: string = 'Terminado'

    //Variables para controlar dialogs
    seleccionarOrdenPDialog: boolean = false;
    confirmarOrdenPDialog: boolean = false;
    editarOrdenDeProduccionDialog: boolean = false;
    confirmarEstadoOrdenPDialog: boolean = false;

    constructor(
      private fb:FormBuilder,
      private ordenPService: OrdenDeProduccionService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute){

        this.formOrdenDeProduccion = this.fb.group({
          nombre_area: ['', [Validators.required]],
          nombre_producto: ['', [Validators.required]],
          cantidad_producto: ['', [Validators.required]],
          fecha_actualizacion_estado: ['', [Validators.required]],
          fecha_entrega_pedido: ['', [Validators.required]],
          estado_orden: ['', [Validators.required]],
        });

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //función de inicialización del componente
    ngOnInit():void {        
        this.getListOrdenesDeProduccion();
        this.getPedidos();               
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todas las ordenes de produccion
    getListOrdenesDeProduccion(){     
        this.ordenPService.getListOrdenesDeProduccion().subscribe((data) =>{      
          this.listOrdenesDeProduccion = data.filter(orden => orden.estado_orden === 'En preparación');        
        })        
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para obtener los datos de una orden de producción por id
    getOrdenDeProduccion(id:string){      
      this.ordenPService.getOrdenDeProduccion(id).subscribe((data:OrdenDeProduccion) => {
       
        this.formOrdenDeProduccion.setValue({
          nombre_area: data.nombre_area,
          nombre_producto: data.nombre_producto,
          cantidad_producto: data.cantidad_producto,
          fecha_actualizacion_estado: data.fecha_actualizacion_estado,
          fecha_entrega_pedido: data.fecha_entrega_pedido,
          estado_orden: data.estado_orden,
        })
      })
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar los pedidos enviados a producción
    getPedidos(){     
      this.ordenPService.getPedidos().subscribe((data) =>{      
        this.listPedidosOrden = data.filter(pedido => pedido.estado_pedido === 'En producción');
      })
      
  }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para generar las ordenes de producción
    generarOrdenesDeProduccion() {
      this.ordenPService.gerararOrdenesDeProduccion(this.idsPedidosSeleccionados).subscribe(
        (response) => {
          if (response && response.message === 'Órdenes de producción generadas exitosamente.') {
            this.messageService.add({
              severity: 'success',
              summary: 'Ordenes de producción',
              detail: 'Se han generado nuevas órdenes de producción exitosamente',
              life: 3000
            });
            this.getListOrdenesDeProduccion();
            this.confirmarOrdenPDialog = false;
            this.seleccionarOrdenPDialog = false;
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'No hay órdenes de producción pendientes',
              life: 3000
            });
            this.confirmarOrdenPDialog = false;
            this.seleccionarOrdenPDialog = false;
          }
        },
        (error) => {
          if (error.error && error.error.error) {
            const errorMessage = error.error.error;
            this.messageService.add({
              severity: 'error',
              summary: 'Error al generar las ordenes de producción',
              detail: errorMessage,
              life: 5000
            });
          } else {
            console.error('Error desconocido al generar las ordenes:', error);
          }
        }
      );
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para actualizar el estado de una orden de producción
    actualizarEstadoOrdenDeProduccion() {
      this.ordenPService.actualizarEstadoOrdenDeProduccion(this.id, this.nuevoEstado).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Orden de producción actualizada',
            detail: 'El estado de la orden de producción fue actualizado con éxito',
            life: 3000
          });
          this.getListOrdenesDeProduccion();
          this.confirmarEstadoOrdenPDialog = false;
        },
        (error) => {
          if (error.error && error.error.error) {
            const errorMessage = error.error.error;
            this.messageService.add({
              severity: 'error',
              summary: 'Error al cambiar el estado de la orden de producción',
              detail: errorMessage,
              life: 3000
            });
          } else {
            console.error('Error desconocido al generar las ordenes:', error);
          }
        }
      )
    }

    confirmarActualizarOrdenDeProduccion(id: string) {
      this.confirmarEstadoOrdenPDialog = true;
      this.id = id;
    }

    noActualizarOrdenDeProduccion() {
      this.confirmarEstadoOrdenPDialog = false;
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para seleccionar los pedidos para generar nuevas ordenes de producción
    seleccionarPedidosOrdenP() {
      this.seleccionarOrdenPDialog = true;
      this.pedidosSeleccionados = [];
      this.idsPedidosSeleccionados = [];
    }

    prepararPedidosSeleccionados() {
      this.confirmarOrdenPDialog = true;
      this.idsPedidosSeleccionados = this.pedidosSeleccionados.map(id => id._id)
      console.log(this.idsPedidosSeleccionados)
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para confirmar generar nuevas ordenes de producción
    confirmarGenerarOrdenP() {
      this.confirmarOrdenPDialog = true;
    }

    //Función para no generar las ordenes de producción
    noGenerarOrdenP() {
      this.confirmarOrdenPDialog = false;
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para generar el contenido del tooltip
    generarContenidoTooltip(detallePedido: any[]): string {
      if (!detallePedido || detallePedido.length === 0) {
        return 'Sin detalles disponibles';
      }
    
      const contenidoTabla = `
      <table style="width: 100%; text-align: center;">
          <thead>
              <tr>
                  <th style="width: 55%;">Producto</th>
                  <th style="width: 45%;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              ${detallePedido.map(item => `
                  <tr>
                      <td style="width: 55%; text-align: center;">${item.nombre_producto}</td>
                      <td style="width: 45%; text-align: center;">${item.cantidad_producto}</td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
`;

    
      return contenidoTabla;
    }
    
    
    

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

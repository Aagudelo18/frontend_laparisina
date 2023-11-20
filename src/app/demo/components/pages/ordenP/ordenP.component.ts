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
    ordenP: OrdenDeProduccion = {}
    formOrdenDeProduccion:FormGroup;
    id: string = '';

    editarOrdenDeProduccionDialog: boolean = false;

    constructor(
      private fb:FormBuilder,
      private ordenPService: OrdenDeProduccionService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute){

        this.formOrdenDeProduccion = this.fb.group({
          nombre_area: [''],
          nombre_producto: [''],
          cantidad_producto: [''],
          fecha_actualizacion_estado: [''],
          fecha_entrega_pedido: [''],
          estado_orden: [''],
        });

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
      }

    ngOnInit():void {        
        this.getListOrdenesDeProduccion()                     
    }

    //Función para listar todas las categorías
    getListOrdenesDeProduccion(){     
        this.ordenPService.getListOrdenesDeProduccion().subscribe((data) =>{      
          this.listOrdenesDeProduccion = data;        
        })        
    }

    //Función para obtener los datos de una categoría por id
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

    //-------------------------------------------------------------------------------------------------------------------------------
    // // Función para actualizar una orden de producción
    // actualizarCategoria() {
    //   const form = this.formCategoria;
    //   if (form.valid) {
    //     const formData = new FormData;
    //     formData.append('nombre_categoria_producto', this.formCategoria.get('nombre_categoria_producto').value);
    //     formData.append('descripcion_categoria_producto', this.formCategoria.get('descripcion_categoria_producto').value);
    //     formData.append('image', this.file);
  
    //     if (this.id !== '') {
    //       this.categoriaService.actualizarCategoria(this.id, formData).subscribe(() => {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'La categoría fue actualizada con éxito',
    //           detail: 'Categoría actualizada',
    //           life: 3000
    //         });
    //         this.getListCategorias();
    //         this.editarCategoriaDialog = false;
    //         this.fileCrear.clear();
    //       });
    //     }
    //   }
    // }
    
    editarCategoria(id:string) {
        this.id = id;
        this.editarOrdenDeProduccionDialog = true;
        this.getOrdenDeProduccion(id)
    }

    cerrarEditarDialog() {
      this.editarOrdenDeProduccionDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

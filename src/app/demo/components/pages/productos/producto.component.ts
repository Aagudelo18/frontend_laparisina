import { Component, OnInit } from '@angular/core';
import { Producto } from './producto.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductoService } from './producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
    templateUrl: './producto.component.html',
    providers: [MessageService]
})
export class ProductoComponent implements OnInit {
    listProductos: Producto[] = []
    producto: Producto = {}
    formProducto:FormGroup;
    id: string = '';

    valSwitch: boolean = false;
    
    cols:any[] = [
      { field: 'id', header: 'ID' },
      { field: 'nombre_categoria_producto', header: 'Nombre' },
      { field: 'descripcion_categoria_producto', header: 'Descripción' },
      { field: 'imagen_categoria_producto', header: 'Imagen' },
      { field: 'estado_categoria_producto', header: 'Estado' }
    ];

    estado:SelectItem[] = [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false }
    ];

    selectedEstado: SelectItem = {value: ''};

    crearProductoDialog: boolean = false;
    editarProductoDialog: boolean = false;

    selectedProducts: Producto[] = [];

    rowsPerPageOptions = [5, 10, 20];


    constructor(private fb:FormBuilder,
      private productoService: ProductoService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute){
        this.formProducto = this.fb.group({
          codigo_producto: ['',Validators.required],
          nombre_producto: ['',Validators.required],
          nombre_categoria_producto: ['',Validators.required],
          descripcion_producto: ['',Validators.required],
          precio_ico: ['', Validators.required],
          precio_por_mayor_ico: ['', Validators.required],
          durabilidad_producto: ['', Validators.required],
          ingredientes_producto: ['', Validators.required],
          imagen_producto: ['', Validators.required],
          estado_producto: ['', Validators.required],

        })
        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
       }

    ngOnInit():void {        
        this.getListProductos()                     
    }

    getListProductos(){     
        this.productoService.getListProductos().subscribe((data) =>{      
          this.listProductos = data;        
        })        
    }

    // getProducto(id:string){      
    //   this.productoService.getProducto(id).subscribe((data:Producto) => {
       
    //     this.formProducto.setValue({
    //       nombre_categoria_producto: data.nombre_categoria_producto,
    //       descripcion_categoria_producto: data.descripcion_categoria_producto,
    //       imagen_categoria_producto: data.imagen_categoria_producto,
    //       estado_categoria_producto: data.estado_categoria_producto,
    //     })
    //   })
    // }


    // addCategoriaP(){
    //   const categoriaP : CategoriaP = {
    //    nombre_categoria_producto: this.formCategoriaP.value.nombre_categoria_producto,
    //    descripcion_categoria_producto: this.formCategoriaP.value.descripcion_categoria_producto,
    //    imagen_categoria_producto: this.formCategoriaP.value.imagen_categoria_producto,
    //    estado_categoria_producto: this.formCategoriaP.value.estado_categoria_producto,
    //   }
 
    //   if(this.id != ''){
    //    categoriaP._id = this.id;
    //    this.categoriaPService.putCategoriaP(this.id,categoriaP).subscribe(() => {
    //     alert('Categoria actualizada con éxito')    
    //     this.messageService.add({
    //         severity: 'info', //'success', 'info', 'warn' o 'error'
    //         summary: `La categoría fue actualizada con éxito`,
    //         detail: 'Categoría actualizada',
    //         life: 6000 // La duración del mensaje en milisegundos
    //       });
    //       this.getListCategoriasP();
    //       this.editarCategoriaPDialog = false;  
    //    })
    //   } else {            
    //    this.categoriaPService.postCategoriaP(categoriaP).subscribe(() => {
    //     alert('Categoría creada con éxito')
    //     this.messageService.add({
    //         severity: 'success', //'success', 'info', 'warn' o 'error'
    //         summary: 'La categoría fue creada con éxito',
    //         detail: 'Categoría creada',
    //         life: 6000 // La duración del mensaje en milisegundos
    //     });
    //     this.getListCategoriasP();
    //     this.crearCategoriaPDialog = false;     
    //    })
    //   }
      
    // }

    // openNew() {
    //     this.id = '';                
    //     this.formCategoriaP.reset()
    //     this.crearCategoriaPDialog = true;
    // }
    
    // editarCategoriaP(id:string) {
    //     this.id = id;
    //     this.editarCategoriaPDialog = true;
    //     this.getCategoriaP(id)
    // }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

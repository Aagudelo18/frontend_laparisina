import { Component, OnInit } from '@angular/core';
import { NewPedidosService } from './new-pedidos.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-new-pedidos',
    templateUrl: './new-pedidos.component.html',
    styleUrls: ['./new-pedidos.component.scss'],
})
export class NewPedidosComponent implements OnInit {
    cities: any;
    

    categorias = [];
    categoriaSeleccionada: string;
    productos: any[] = [];
    productosCategoria: any[] = [];
    productsFormArray: FormArray;


    constructor(
        private newpedidosService: NewPedidosService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {
        this.categoriaSeleccionada = '';
    }

    pedido: any = {
        codigo_cliente: '',
        nombre_recibe: '',
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_entrega: '',
        edificio_apto_barrio: '',
        ciudad: '',
        fecha_entrega_pedido: '',
        cantidad: 0,
    };

    ngOnInit() {
        this.getCategorias();
        this.getProductos();
    }

    getProductos() {
        this.newpedidosService.getAllProductos().subscribe(
            (data) => {
                this.productos = data;
                console.log(this.productos);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    getCategorias() {
        this.newpedidosService.getAllCategorias().subscribe(
            (data) => {
                this.categorias = data;
                console.log(this.categorias);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    categoriaOnChange() {
        console.log(this.categoriaSeleccionada);
        this.productosCategoria = this.productos.filter(
            (producto) =>
                producto.nombre_categoria_producto ===
                this.categoriaSeleccionada
        );
        console.log(this.productosCategoria);
    }

     createProductGroup(): FormGroup{
      return this.formBuilder.group({
        nombre_producto: [''],
        nombre_categoria_producto: [''],
        fecha_pedido_tomado: [''],
        cantidad_producto: [''],
        precio_ico: [''],
        precio_total_producto: [''],
      })
    }

    agregarProducto(){
      const productGroup= this.createProductGroup();
      this.productsFormArray.push(productGroup);
      
      
    }

   
}

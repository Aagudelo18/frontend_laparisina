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
    precio_total_venta: number;
    iva_pedido: number;
    subtotal_venta:number;


    locacionesEntrega = [
        { name: 'Casa', value: 'casa' },
        { name: 'Edificio', value: 'edificio' },
        { name: 'Apto', value: 'apto' }
    ];

    metodoPago = [
        { name: 'Transferencia', value: 'transferencia'},
        { name: 'Efectivo', value: 'efectivo'}
    ];

    categorias = [];
    categoriaSeleccionada: string;
    productoSeleccionado: any[] = [];
    productos: any[] = [];
    productosCategoria: any[] = [];
    productsFormArray: FormArray;
    cantidad_producto: number;

    constructor(
        private newpedidosService: NewPedidosService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.categoriaSeleccionada = '';
        this.productoSeleccionado = [];
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
        detalle_pedido: []
    };

    ngOnInit() {
        this.getCategorias();
        this.getProductos();
        this.productsFormArray = this.formBuilder.array([]);
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

    createProductGroup(): FormGroup {
        return this.formBuilder.group({
            nombre_producto: [''],
            nombre_categoria_producto: [''],
            cantidad_producto: [''],
            precio_ico: [''],
            precio_total_producto: [''],
        });
    }

    agregarProductoExistente() {
        const existingProductIndex = this.productsFormArray.controls.findIndex((control) =>
            control.get('nombre_producto')?.value === this.productoSeleccionado['nombre_producto']
        );
    
        if (existingProductIndex > -1) {
            this.actualizarProductoExistente(existingProductIndex);
            this.calcularPrecioTotalVenta(); // Calcula los totales después de la actualización
        } else {
            this.agregarProducto();
            this.calcularPrecioTotalVenta(); // Calcula los totales después de la adición
        }
    }
    
    
    agregarProducto() {
        let precio_total = this.cantidad_producto * this.productoSeleccionado['precio_ico'];
    
        const productGroup = this.createProductGroup();
        productGroup.patchValue({
            nombre_producto: this.productoSeleccionado['nombre_producto'],
            nombre_categoria_producto: this.productoSeleccionado['nombre_categoria_producto'],
            cantidad_producto: this.cantidad_producto,
            precio_ico: this.productoSeleccionado['precio_ico'],
            precio_total_producto: precio_total,
        });
    
        this.productsFormArray.push(productGroup);
        this.calcularPrecioTotalVenta(); // Calcula los totales después de la adición
    }
    
    actualizarProductoExistente(existingProductIndex: number) {
        const existingProduct = this.productsFormArray.controls[existingProductIndex];
        const cantidad = existingProduct.get('cantidad_producto')?.value + this.cantidad_producto;
        const precioUnitario = this.productoSeleccionado['precio_ico'];
        const precioTotal = cantidad * precioUnitario;
    
        existingProduct.patchValue({
            cantidad_producto: cantidad,
            precio_total_producto: precioTotal,
        });
    
        this.calcularPrecioTotalVenta(); // Calcula los totales después de la actualización
    }

    eliminarProducto(product: FormGroup) {
        const index = this.productsFormArray.controls.indexOf(product);
        if (index !== -1) {
            this.productsFormArray.removeAt(index);
            this.calcularSubtotal(),
            this. calcularPrecioTotalVenta()

        }

    }

    crearPedido() {
        this.pedido.detalle_pedido = this.productsFormArray.value;
    
        this.newpedidosService.createPedido(this.pedido).subscribe(
            (response) => {
                console.log('Pedido creado con éxito:', response);
                // Otras acciones después de crear el pedido
            },
            (error) => {
                console.error('Error al crear el pedido:', error);
                // Manejo de errores
            }
        );
    }


        // Método para calcular el subtotal de todos los productos
            calcularSubtotal() {
            let subTotal = 0;
            this.productsFormArray.controls.forEach((product: any) => {
                subTotal += product.get('precio_total_producto')?.value;
            });
            console.log(this.iva_pedido)
            // Calcular el IVA (con un 19%)
            this.iva_pedido = subTotal * 0.19;

            return subTotal;
        }

        // Método para calcular el precio total de venta
        calcularPrecioTotalVenta() {
            const subTotal = this.calcularSubtotal();
            this.subtotal_venta = subTotal;
            this.precio_total_venta = subTotal + this.iva_pedido;
        }
    
    
}

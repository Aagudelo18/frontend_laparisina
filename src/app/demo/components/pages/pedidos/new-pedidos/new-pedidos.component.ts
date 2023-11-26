import { Component, OnInit } from '@angular/core';
import { NewPedidosService } from './new-pedidos.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-new-pedidos',
    templateUrl: './new-pedidos.component.html',
    styleUrls: ['./new-pedidos.component.scss'],
    providers: [MessageService],
})
export class NewPedidosComponent implements OnInit {
    precio_total_venta: number;
    valor_domicilio: number;
    subtotal_venta: number;
    aumento_empresa: number;


    metodoPago = ['Transferencia', 'Efectivo'];
    categorias = [];
    clientes = [];
    categoriaSeleccionada: string;
    productoSeleccionado: any[] = [];
    productos: any[] = [];
    productosCategoria: any[] = [];
    productsFormArray: FormArray;
    cantidad_producto: number;

    constructor(
        private newpedidosService: NewPedidosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
       
    ) {
        this.categoriaSeleccionada = '';
        this.productoSeleccionado = [];
    }

    pedido: any = {
        documento_cliente: '',
        tipo_cliente: '',
        nombre_contacto: '',
        quien_recibe: '',
        nombre_juridico: '',
        nit_empresa_cliente: '',
        telefono_cliente: '',
        direccion_entrega: '',
        ciudad_cliente: '',
        barrio_cliente: '',
        fecha_entrega_pedido: '',
        correo_domiciliario: '',
        valor_domicilio: null,
        metodo_pago: '',
        subtotal_venta: 0,
        precio_total_venta: 0,
        aumento_empresa: 0,
        detalle_pedido: [
        ],
    };

    ngOnInit() {
        this.getCategorias();
        this.getProductos();
        this.productsFormArray = this.formBuilder.array([]);
       
    }

    eliminarProducto(product: FormGroup) {
        const index = this.productsFormArray.controls.indexOf(product);
        if (index !== -1) {
            this.productsFormArray.removeAt(index);
            this.calcularSubtotal(), this.calcularPrecioTotalVenta();
        }
    }

    cancelarCreacion() {
        this.router.navigate(['/list-pedidos']);
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

    getCliente(documento_cliente: string) {
        this.newpedidosService.getCliente(documento_cliente).subscribe(
            (data: any) => {
                // Actualizar las propiedades del objeto 'pedido' con la información del cliente
                this.pedido.tipo_cliente = data.tipo_cliente;
                this.pedido.nombre_contacto = data.nombre_contacto;
                this.pedido.telefono_cliente = data.telefono_cliente;
                this.pedido.direccion_entrega = data.direccion_cliente;
                this.pedido.ciudad_cliente = data.ciudad_cliente;
                this.pedido.barrio_cliente = data.barrio_cliente;
                this.pedido.nombre_juridico = data.nombre_juridico;
                this.pedido.nit_empresa_cliente = data.nit_empresa_cliente;
                console.log(data);
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
            precio_por_mayor_ico: [''],
            precio_total_producto: [''],
        });
    }

    crearPedido() {
        const subTotal = this.calcularSubtotal();
        this.aumento_empresa = subTotal * 0.08; 
        this.pedido.fecha_entrega_pedido = this.pedido.fecha_entrega_pedido.toISOString().split('T')[0],
        // Asegúrate de que la propiedad 'detalle_pedido' esté definida como un array
        this.pedido.detalle_pedido = this.productsFormArray.value || [];

        this.newpedidosService.createPedido(this.pedido).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Pedido creado con Éxito',
                    life: 3000
                  });   
                  this.router.navigate(['/list-pedidos']);                 
            },
            (error) => {
                if (error.error && error.error.error) {
                    const errorMessage = error.error.error;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error al crear el Pedido',
                      detail: errorMessage,
                      life: 5000
                    });
                  } else {
                    console.error('Error desconocido al crear el Pedido:', error);
                  }
            }
        );
    }


    agregarProductoExistente() {
        const existingProductIndex = this.productsFormArray.controls.findIndex(
            (control) =>
                control.get('nombre_producto')?.value ===
                this.productoSeleccionado['nombre_producto']
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
        let precio_total
        if(this.pedido.tipo_cliente == 'Persona natura') {
            precio_total =this.cantidad_producto * this.productoSeleccionado['precio_ico'];
        } else {
            precio_total= this.cantidad_producto * this.productoSeleccionado['precio_por_mayor_ico']
        }
        
        const productGroup = this.createProductGroup();
        productGroup.patchValue({
            nombre_producto: this.productoSeleccionado['nombre_producto'],
            nombre_categoria_producto:this.productoSeleccionado['nombre_categoria_producto'],
            cantidad_producto: this.cantidad_producto,
            precio_ico: this.productoSeleccionado['precio_ico'],
            precio_por_mayor_ico: this.productoSeleccionado['precio_por_mayor_ico'],
            precio_total_producto: precio_total,
        });

        this.productsFormArray.push(productGroup);
        this.calcularPrecioTotalVenta(); // Calcula los totales después de la adición
    }

    actualizarProductoExistente(existingProductIndex: number) {
        const existingProduct =this.productsFormArray.controls[existingProductIndex];
        const cantidad = existingProduct.get('cantidad_producto')?.value + this.cantidad_producto;
        let precio;
        if(this.pedido.tipo_cliente == 'Empresa'){
            precio = this.productoSeleccionado['precio_por_mayor_ico'];
        }else {
            precio = this.productoSeleccionado['precio_ico'];
        }
        const precioTotal = cantidad * precio;

        existingProduct.patchValue({
            cantidad_producto: cantidad,
            precio_total_producto: precioTotal,
        });

        this.calcularPrecioTotalVenta(); // Calcula los totales después de la actualización
    }

   
    // Método para calcular el subtotal de todos los productos
    calcularSubtotal() {
        let subTotal = 0;
        this.productsFormArray.controls.forEach((product: any) => {
            subTotal += product.get('precio_total_producto')?.value;
        });
        console.log(this.aumento_empresa);
        // Calcular el IVA (con un 8%)
        this.aumento_empresa = subTotal * 0.08;

        return subTotal;
    }
    

    // Método para calcular el precio total de venta
    calcularPrecioTotalVenta() {       
        const subTotal = this.calcularSubtotal();
        this.pedido.subtotal_venta = subTotal;
        if(this.pedido.valor_domicilio == null){
            this.pedido.valor_domicilio = 0
        }
        if(this.pedido.tipo_cliente == 'Empresa'){
            this.pedido.precio_total_venta = subTotal + this.aumento_empresa + this.pedido.valor_domicilio;
        }else {
            this.pedido.precio_total_venta = subTotal + this.pedido.valor_domicilio;           
        }
       
    }


 
}

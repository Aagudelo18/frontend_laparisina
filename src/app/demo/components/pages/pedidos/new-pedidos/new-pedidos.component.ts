import { Component, OnInit } from '@angular/core';
import { NewPedidosService } from './new-pedidos.service';
import { Router } from '@angular/router';
import {
    FormGroup,
    FormArray,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';


@Component({
    selector: 'app-new-pedidos',
    templateUrl: './new-pedidos.component.html',
    styleUrls: ['./new-pedidos.component.scss'],
    providers: [MessageService],
    
})
export class NewPedidosComponent implements OnInit {
    precio_total_venta: number;
    subtotal_venta: number;
    aumento_empresa: number;
    pedido: FormGroup;
    formulario: FormGroup;

    metodoPago = ['Transferencia', 'Efectivo'];
    estadoPago = ['Pagado', 'Pendiente'];
    categorias = [];
    clientes = [];
    categoriaSeleccionada: string;
    productoSeleccionado: any[] = [];
    productos: any[] = [];
    productosCategoria: any[] = [];
    productsFormArray: FormArray;
    cantidad_producto: number;
    clienteExistente: boolean = false;
    minDate: Date = new Date();

    constructor(
        private newpedidosService: NewPedidosService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.categoriaSeleccionada = '';
        this.productoSeleccionado = [];

        this.pedido = this.fb.group({
            documento_cliente: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)],
            ],
            tipo_cliente: ['', Validators.required],
            nombre_contacto: ['', Validators.required],
            quien_recibe: ['', Validators.required],
            nombre_juridico: ['', Validators.required],
            nit_empresa_cliente: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)],
            ],
            telefono_cliente: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)],
            ],
            direccion_entrega: ['', Validators.required],
            ciudad_cliente: ['', Validators.required],
            barrio_cliente: ['', Validators.required],
            fecha_entrega_pedido: ['', [Validators.required]],
            correo_domiciliario: ['', [Validators.required, Validators.email]],
            metodo_pago: ['', Validators.required],
            estado_pago: ['', Validators.required],
            valor_domicilio: [0, [Validators.required, Validators.min(0)]],
            subtotal_venta: [0, Validators.min(0)],
            precio_total_venta: [0, Validators.min(0)],
            aumento_empresa: [0, Validators.min(0)],
            detalle_pedido: [],
        });

        this.formulario = new FormGroup({
            fechaEntrega: new FormControl(null), // Aquí puedes establecer el valor inicial si lo deseas
        });
    }

    ngOnInit() {
        this.getCategorias();
        this.getProductos();
        this.productsFormArray = this.fb.array([]);
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
        // Verificar si el documento está vacío
        if (!documento_cliente) {
            // Limpiar los valores de los campos relacionados con el cliente
            this.pedido.get('tipo_cliente').reset();
            this.pedido.get('nit_empresa_cliente').reset();
            this.pedido.get('nombre_juridico').reset();
            this.pedido.get('nombre_contacto').reset();
            this.pedido.get('quien_recibe').reset();
            this.pedido.get('telefono_cliente').reset();
            this.pedido.get('direccion_entrega').reset();
            this.pedido.get('ciudad_cliente').reset();
            this.pedido.get('barrio_cliente').reset();

            // Actualiza el valor de la variable 'clienteExistente'
            this.clienteExistente = false;

            // Puedes agregar cualquier otro campo que necesites reiniciar aquí
        } else {
            this.newpedidosService.getCliente(documento_cliente).subscribe(
                (data: any) => {
                    // Verificar si el cliente existe
                    if (data) {
                        // Verificar si el estado_cliente es True
                        if (data.estado_cliente) {
                            this.clienteExistente = true;
                            // Actualizar las propiedades del formulario 'pedido' con la información del cliente
                            this.pedido
                                .get('tipo_cliente')
                                ?.setValue(data.tipo_cliente);
                            this.pedido
                                .get('nombre_contacto')
                                ?.setValue(data.nombre_contacto);
                            this.pedido
                                .get('telefono_cliente')
                                ?.setValue(data.telefono_cliente);
                            this.pedido
                                .get('direccion_entrega')
                                ?.setValue(data.direccion_cliente);
                            this.pedido
                                .get('ciudad_cliente')
                                ?.setValue(data.ciudad_cliente);
                            this.pedido
                                .get('barrio_cliente')
                                ?.setValue(data.barrio_cliente);
                            this.pedido
                                .get('nombre_juridico')
                                ?.setValue(data.nombre_juridico);
                            this.pedido
                                .get('nit_empresa_cliente')
                                ?.setValue(data.nit_empresa_cliente);
                            console.log(data);
                        } else {
                            this.clienteExistente = false;
                            // El estado_cliente es False, puedes manejarlo según tus necesidades
                            this.messageService.add({
                                severity: 'error',
                                summary: 'El cliente no está activo',
                                life: 3000,
                            });
                        }
                    } else {
                        // El cliente no existe, puedes manejarlo según tus necesidades
                        this.clienteExistente = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'El cliente no está registrado',
                            life: 3000,
                        });
                    }
                },
                (error) => {
                    console.error(error);

                    // Manejar el error de la solicitud HTTP
                    if (error.status === 404) {
                        // El cliente no se encontró en el servidor
                        this.clienteExistente = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Cliente no encontrado',
                            detail: 'El cliente no está registrado',
                            life: 3000,
                        });
                    } else {
                        // Otro manejo de errores según tus necesidades
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error en la solicitud',
                            detail: 'Ocurrió un error al obtener los detalles del cliente',
                            life: 3000,
                        });
                    }
                }
            );
        }
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
        return this.fb.group({
            nombre_producto: ['', Validators.required],
            nombre_categoria_producto: ['', Validators.required],
            cantidad_producto: ['', Validators.required],
            precio_ico: ['', Validators.required],
            precio_por_mayor_ico: ['', Validators.required],
            precio_total_producto: ['', Validators.required],
        });
    }

    crearPedido() {
        // Verificar si la fecha de entrega está vacía
        if (!this.pedido.get('fecha_entrega_pedido').value) {
            this.messageService.add({
                severity: 'error',
                summary: 'La fecha de entrega es requerida',
                life: 3000,
            });
            return; // Salir del método si la fecha de entrega está vacía
        }

        // Formatear la fecha de entrega en formato YY/MM/DD
        const fechaEntrega = this.pedido
            .get('fecha_entrega_pedido')
            .value.toISOString()
            .substring(0, 10);
        this.pedido.get('fecha_entrega_pedido').setValue(fechaEntrega);

        // // Obtener el valor del campo "Valor Domicilio" del formulario
        // const valorDomicilio = this.pedido.get('valor_domicilio').value;

        // // Verificar si el valor del domicilio es menor o igual a 0
        // if (valorDomicilio <= 0) {
        //     // Mostrar mensaje de advertencia
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Advertencia',
        //         detail: 'El valor del domicilio es CERO.',
        //     });
        //     return; // Detener la creación del pedido
        // }

        const subTotal = this.calcularSubtotal();
        this.aumento_empresa = subTotal * 0.08;

        // Asegúrate de que la propiedad 'detalle_pedido' esté definida como un array
        this.pedido
            .get('detalle_pedido')
            ?.patchValue(this.productsFormArray.value || []);

        this.newpedidosService
            .createPedido(this.pedido.getRawValue())
            .subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Pedido creado con Éxito',
                        life: 3000,
                    });

                    // Agregar un pequeño retraso antes de navegar a la página de listado de pedidos
                    timer(1000).subscribe(() => {
                        this.router.navigate(['/list-pedidos']);
                    });
                },
                (error) => {
                    if (error.error && error.error.error) {
                        const errorMessage = error.error.error;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al crear el Pedido',
                            detail: errorMessage,
                            life: 3000,
                        });
                    } else {
                        console.error(
                            'Error desconocido al crear el Pedido:',
                            error
                        );
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
        let precio_total;
        if (this.pedido.get('tipo_cliente')?.value === 'Persona natural') {
            precio_total =
                this.cantidad_producto *
                this.productoSeleccionado['precio_ico'];
        } else {
            precio_total =
                this.cantidad_producto *
                this.productoSeleccionado['precio_por_mayor_ico'];
        }
        console.log(this.cantidad_producto);
        const productGroup = this.createProductGroup();
        productGroup.patchValue({
            nombre_producto: this.productoSeleccionado['nombre_producto'],
            nombre_categoria_producto:
                this.productoSeleccionado['nombre_categoria_producto'],
            cantidad_producto: this.cantidad_producto,
            precio_ico: this.productoSeleccionado['precio_ico'],
            precio_por_mayor_ico:
                this.productoSeleccionado['precio_por_mayor_ico'],
            precio_total_producto: precio_total,
        });

        this.productsFormArray.push(productGroup);
        console.log(this.productsFormArray.value);

        this.calcularPrecioTotalVenta(); // Calcula los totales después de la adición
    }

    actualizarProductoExistente(existingProductIndex: number) {
        const existingProduct =
            this.productsFormArray.controls[existingProductIndex];
        const cantidad =
            existingProduct.get('cantidad_producto')?.value +
            this.cantidad_producto;
        let precio;
        if (this.pedido.get('tipo_cliente')?.value == 'Empresa') {
            precio = this.productoSeleccionado['precio_por_mayor_ico'];
        } else {
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
        this.pedido.get('subtotal_venta')?.setValue(subTotal);
        var valor_domicilio = this.pedido.get('valor_domicilio').value;
        if (valor_domicilio == null) {
            valor_domicilio = 0;
        }

        this.aumento_empresa = subTotal * 0.08;
        
        if (this.pedido.get('tipo_cliente')?.value == 'Empresa') {
            this.pedido
                .get('precio_total_venta')
                ?.setValue(subTotal + this.aumento_empresa + valor_domicilio);
        } else {
            this.pedido
                .get('precio_total_venta')
                ?.setValue(subTotal + valor_domicilio);
        }
    }

    eliminarCerosIzquierda(event: any) {
        let valor = event.target.value;
        valor = valor.replace(/^0+(?=[1-9])/, ''); // Eliminar ceros a la izquierda
        event.target.value = valor; // Establecer el nuevo valor en el input
        valor = parseFloat(valor); // Convertir el valor a un número
        this.pedido.get('valor_domicilio').setValue(valor); // Establecer el valor en el formulario
        this.calcularPrecioTotalVenta(); // Recalcular el precio total de venta
    }
    
}

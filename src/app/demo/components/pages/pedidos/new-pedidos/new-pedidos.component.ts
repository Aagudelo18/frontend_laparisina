import { Component, OnInit } from '@angular/core';
import { NewPedidosService } from './new-pedidos.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

function fechaNoMenorActual(control: AbstractControl): { [key: string]: boolean } | null {
  const fechaIngresada = new Date(control.value);
  const fechaActual = new Date();

  if (fechaIngresada < fechaActual) {
    return { 'fechaMenorActual': true };
  }

  return null;
}

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
      fecha_entrega_pedido: ['', [Validators.required, fechaNoMenorActual]],
      correo_domiciliario: ['', [Validators.required, Validators.email]],
      metodo_pago: ['', Validators.required],
      valor_domicilio: [0, [Validators.required, Validators.min(0)]],
      subtotal_venta: [0, Validators.min(0)],
      precio_total_venta: [0, Validators.min(0)],
      aumento_empresa: [0, Validators.min(0)],
      detalle_pedido: [],
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
        this.newpedidosService.getCliente(documento_cliente).subscribe(
            (data: any) => {
                // Actualizar las propiedades del formulario 'pedido' con la información del cliente
                this.pedido.get('tipo_cliente')?.setValue(data.tipo_cliente);
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
        const subTotal = this.calcularSubtotal();
        this.aumento_empresa = subTotal * 0.08;
        // Obtener la fecha actual
        const currentDate = new Date();

        // Formatear la fecha como YYYY-MM-DD
        const formattedDate = `${currentDate.getFullYear()}-${(
            currentDate.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}-${currentDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;

        // Establecer la fecha en el formulario
        this.pedido.get('fecha_entrega_pedido')?.setValue(formattedDate);
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
                    this.router.navigate(['/list-pedidos']);
                },
                (error) => {
                    if (error.error && error.error.error) {
                        const errorMessage = error.error.error;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al crear el Pedido',
                            detail: errorMessage,
                            life: 5000,
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
        if (this.pedido.get('valor_domicilio')?.value == null) {
            this.pedido.get('valor_domicilio')?.setValue(0);
        }
        if (this.pedido.get('tipo_cliente')?.value == 'Empresa') {
            this.pedido
                .get('precio_total_venta')
                ?.setValue(
                    subTotal +
                        this.aumento_empresa +
                        this.pedido.get('valor_domicilio')?.value
                );
        } else {
            this.pedido
                .get('precio_total_venta')
                ?.setValue(
                    subTotal + this.pedido.get('valor_domicilio')?.value
                );
        }
    }
}

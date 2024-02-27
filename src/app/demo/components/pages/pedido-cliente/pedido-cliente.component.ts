import { Component, OnInit } from '@angular/core';
import { PedidoClienteService } from './pedido-cliente.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
    selector: 'app-pedido-cliente',
    templateUrl: './pedido-cliente.component.html',
    styleUrls: ['./pedido-cliente.component.scss'],
    providers: [MessageService],
})
export class PedidoClienteComponent implements OnInit {
    clienteExistente: boolean = false;
    pedido: FormGroup;
    producto: FormGroup;
    productosCarrito: any[] = [];
    cliente: any;
    productosSeleccionados: any[] = [];
    metodoPago = ['Transferencia', 'Efectivo'];
    totalCarrito: number = 0;
    minDate: Date = new Date();
    currentUser: any [];

    constructor(
        private pedidoClienteService: PedidoClienteService,
        private fb: FormBuilder,
        private pr: FormBuilder,
        private messageService: MessageService,
        private router: Router,
    ) {
        this.pedido = this.fb.group({
            tipo_cliente: new FormControl(''),
            documento_cliente: new FormControl(''),
            nombre_contacto: new FormControl(''),
            quien_recibe: new FormControl(''),
            telefono_cliente: new FormControl(''),
            ciudad_cliente: new FormControl(''),
            barrio_cliente: new FormControl(''),
            direccion_entrega: new FormControl(''),
            fecha_entrega_pedido: new FormControl(''),
            metodo_pago: new FormControl(''),
            subtotal_venta: new FormControl(''), 
            precio_total_venta: new FormControl(''), 
            valor_domicilio: new FormControl(0),
            nit_empresa_cliente: new FormControl(''),
            nombre_juridico: new FormControl(''),

            detalle_pedido: [],
        });

        this.producto = this.pr.group({
            nombre_producto: new FormControl(''),
            precio_ico: new FormControl(''),
            cantidad_producto: new FormControl(''),
            precio_total_producto: new FormControl(''),
    });
    this.productosCarrito = pedidoClienteService.obtenerCarrito();
    this.calcularPrecioTotalCarrito();
    }

    ngOnInit() {
        this.pedido.get('fecha_entrega_pedido')?.setValue(new Date());
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        this.obtenerDatosCliente(currentUser.correo_electronico);
        this.obtenerProductosCarritoLocalStorage();
       this.calcularPrecioTotalVentaPersonaJuridica();
       this.calcularPrecioTotalVentaPersonaNatural();
       
    }

    // Metodo para traer los datos del cliente logueado------------------------------------------------------>
   obtenerDatosCliente(correo_cliente: string): void {
        this.pedidoClienteService
            .obtenerClientePorCorreo(correo_cliente)
            .subscribe(
                (data: any) => {
                    this.cliente = data;
                    this.pedido.patchValue({
                        tipo_cliente: data.tipo_cliente,
                        nombre_contacto: data.nombre_contacto,
                        documento_cliente: data.numero_documento_cliente,
                        quien_recibe: data.nombre_contacto,
                        ciudad_cliente: data.ciudad_cliente,
                        barrio_cliente: data.barrio_cliente,
                        direccion_entrega: data.direccion_cliente,
                        telefono_cliente: data.telefono_cliente,
                        nit_empresa_cliente: data.nit_empresa_cliente,
                        nombre_juridico: data.nombre_juridico,

                        // Otros campos del formulario según los datos del cliente...
                    });
                    localStorage.setItem('documento_cliente', data.numero_documento_cliente);
                    // Luego, realizar la validación del tipo de cliente y calcular el precio total de venta
                    if (data.tipo_cliente === 'Persona jurídica') {
                        this.calcularPrecioTotalVentaPersonaJuridica();
                    } else {
                        this.calcularPrecioTotalVentaPersonaNatural();
                    }
                },
                (error) => {
                    console.error(error);
                    // Manejar errores según sea necesario
                }
            );
    }


    // Metodo para traer la información de los productos del localStorage------------------------------>
    obtenerProductosCarritoLocalStorage(): void {
        const carritoString = localStorage.getItem('carritoProductosParisina');
        if (carritoString) {
            this.productosCarrito = JSON.parse(carritoString);
        } else {
            this.productosCarrito = [];
        }
    }

    // Metodo para calcular el precio total Persona Juridíca ---------------------------------------------------------------->
    calcularPrecioTotalVentaPersonaJuridica(): number {
        const subTotal = this.calcularSubtotal();
        const aumento_empresa = subTotal * 0.08;
        const valor_domicilio = this.pedido.get('valor_domicilio').value || 0;
        const precioTotalVenta = subTotal + aumento_empresa + valor_domicilio;
        this.pedido.get('subtotal_venta')?.setValue(subTotal);
        this.pedido.get('precio_total_venta')?.setValue(precioTotalVenta);
        return precioTotalVenta;
    }

    // Metodo para calcular el precio total Persona Natural ---------------------------------------------------------------->
    calcularPrecioTotalVentaPersonaNatural():  number {
        const subTotal = this.calcularSubtotal();
        const valor_domicilio = this.pedido.get('valor_domicilio').value || 0;
        const precioTotalVenta = subTotal + valor_domicilio;
        this.pedido.get('subtotal_venta')?.setValue(subTotal);
        this.pedido.get('precio_total_venta')?.setValue(precioTotalVenta);
        return precioTotalVenta;
    }

    // Metodo para calcular el subtotal del pedido ---------------------------------------------------->
    calcularSubtotal() {
        let subTotal = 0;
        this.productosCarrito.forEach((product: any) => {
            subTotal += product.precio_total_producto;
        });
        return subTotal;
    }
       //-------------------------------------------------------------------------------------------------------------------------------
    //función calcular precio total del carrito
    calcularPrecioTotalCarrito(): void {
        this.totalCarrito = this.productosCarrito.reduce((total, producto) => {
          return total + (producto.precio_total_producto || 0);  // Asegúrate de manejar el caso de que precio_total_producto sea undefined
        }, 0);
      }

      crearPedidoCliente() {
        // Verificar si hay productos en el carrito
        if (this.productosCarrito.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el Pedido',
                detail: 'Debes agregar al menos un producto al pedido.',
                life: 3000,
            });
            return;
        }
    
        // Obtener la fecha de entrega del formulario
        const fechaEntregaPedido = this.pedido.get('fecha_entrega_pedido').value;
    
        // Verificar si la fecha de entrega está vacía o no es válida
        if (!fechaEntregaPedido || isNaN(fechaEntregaPedido.getTime())) {
            this.messageService.add({
                severity: 'error',
                summary: 'La fecha de entrega es requerida y debe ser válida',
                
                life: 3000,
            });
            return;
        }
    
        // Construir el objeto del pedido
        const pedidoCliente = {
            nombre_contacto: this.pedido.get('nombre_contacto').value,
            documento_cliente: this.pedido.get('documento_cliente').value,
            telefono_cliente: this.pedido.get('telefono_cliente').value,
            tipo_cliente: this.cliente.tipo_cliente,
            quien_recibe: this.pedido.get('quien_recibe').value,
            ciudad_cliente: this.pedido.get('ciudad_cliente').value,
            barrio_cliente: this.pedido.get('barrio_cliente').value,
            direccion_entrega: this.pedido.get('direccion_entrega').value,
            fecha_entrega_pedido: fechaEntregaPedido.toISOString().substring(0, 10),
            metodo_pago: this.pedido.get('metodo_pago').value,
            subtotal_venta: this.calcularSubtotal(),
            precio_total_venta: this.pedido.get('precio_total_venta').value,
            estado_pago: 'Pendiente',
            valor_domicilio: 0,
            nit_empresa_cliente: this.cliente.tipo_cliente == 'Persona jurírica' ?  this.cliente.nit_empresa_cliente : null,
            nombre_juridico: this.cliente.tipo_cliente == 'Persona jurírica' ? this.cliente.nombre_juridico: null,
            aumento_empresa: this.cliente.tipo_cliente == 'Persona jurírica' ? this.calcularSubtotal() * 0.08 : 0,
            detalle_pedido: this.productosCarrito.map(producto => ({
                nombre_producto: producto.nombre_producto,
                cantidad_producto: producto.cantidad_producto,
                precio_ico: producto.precio_ico,
                precio_por_mayor_ico: producto.precio_por_mayor_ico,
                precio_total_producto: producto.precio_total_producto
            }))
        };
    
        // Llamar al servicio para crear el pedido
        this.pedidoClienteService.createPedido(pedidoCliente).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Pedido creado con Éxito',
                    life: 3000,
                });
    
                // Navegar a la página de listado de pedidos después de un pequeño retraso
                timer(1000).subscribe(() => {
                    this.router.navigate(['/pedidoListar']);
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
                    console.error('Error desconocido al crear el Pedido:', error);
                }
            }
        );
    }
    
    
    
}

  


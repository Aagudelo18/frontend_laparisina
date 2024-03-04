import { Component, OnInit } from '@angular/core';
import { PedidoClienteService } from './pedido-cliente.service';
import { FormGroup, FormBuilder, FormControl,Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { ProductoCarrito } from '../product-list/product-list.model';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-pedido-cliente',
    templateUrl: './pedido-cliente.component.html',
    styleUrls: ['./pedido-cliente.component.scss'],
    providers: [MessageService, ConfirmationService],
    
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
    resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
    cambiarEstadoPDialogAnular: boolean;

    constructor(
        private pedidoClienteService: PedidoClienteService,
        private fb: FormBuilder,
        private pr: FormBuilder,
        private messageService: MessageService,
        private LayoutService: LayoutService,
       
        private router: Router,
    ) {
        this.pedido = this.fb.group({
            tipo_cliente: ['', Validators.required],
            documento_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
            nombre_contacto: ['', Validators.required],
            quien_recibe: ['',[Validators.required, Validators.maxLength(20), Validators.pattern(/^(?!.*\s{2,})[A-Za-zÑñÁáÉéÍíÓóÚú\s-]{3,20}$/)]],
            ciudad_cliente: ['',[Validators.required, Validators.maxLength(20), Validators.pattern(/^(?!.*\s{2,})[A-Za-zÑñÁáÉéÍíÓóÚú\s-]{3,20}$/)]],
            telefono_cliente: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d*$/)]],
            barrio_cliente: ['',[Validators.required, Validators.maxLength(20), Validators.pattern(/^(?!.*\s{2,})[A-Za-zÑñÁáÉéÍíÓóÚú\s-]{3,20}$/)]],
            direccion_entrega: ['', Validators.required], 
            fecha_entrega_pedido: ['', Validators.required],
            metodo_pago: ['', Validators.required],
            subtotal_venta: ['', Validators.required], 
            precio_total_venta: ['', Validators.required], 
            valor_domicilio: [0, [Validators.required, Validators.min(0)]],
            nit_empresa_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            nombre_juridico: ['', Validators.required],
            detalle_pedido: [[]],
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

    private esperarRespuesta(): Promise<boolean> {
        return new Promise<boolean>((resolver) => {
            this.resolverPromesa = resolver;
        });
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
          // Agregar mensajes de validación para otros campos aquí...
    if (this.pedido.get('quien_recibe').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de quien recibe es requerido.' });
        return;
    }
    if (this.pedido.get('ciudad_cliente').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La ciudad es requerida.' });
        return;
    }
    if (this.pedido.get('barrio_cliente').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El barrio es requerido.' });
        return;
    }
    if (this.pedido.get('telefono_cliente').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El teléfono se requerida.' });
        return;
    }
    if (this.pedido.get('fecha_entrega_pedido').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de entrega es requerida.' });
        return;
    }
    if (this.pedido.get('direccion_entrega').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La dirección es requerida.' });
        return;
    }
    if (this.pedido.get('metodo_pago').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El metodo de pago es requerida.' });
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
                }
                );
               this.limpiarCarrito();
    
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

    limpiarCarrito() {
        this.LayoutService.ClearCar.emit('evento');
      }

    quitarEspaciosBlancos(controlName: string): void {
        const control = this.pedido.get(controlName);
        if (control && control.value) {
            control.setValue(control.value.trim());
        }
    }

  // Función para eliminar un producto del carrito
eliminarProductoCarrito(producto: ProductoCarrito) {
    const index = this.productosCarrito.findIndex(
      (p) => p.nombre_producto === producto.nombre_producto
    );
    if (index !== -1) {
        // Elimina el producto del carrito
        this.productosCarrito.splice(index, 1);
        // Actualiza el total del carrito
        this.actualizarTotalCarrito();
        // Guarda los cambios en el carrito (si es necesario)
        this.guardarCarritoEnLocalStorage();
        this.LayoutService.DeleteProdutCar.emit(producto)
    }
  }
  
  // Función para actualizar el total del carrito
  actualizarTotalCarrito() {
    this.totalCarrito = this.productosCarrito.reduce(
      (total, producto) => total + producto.precio_total_producto,
      0
    );
  }
  guardarCarritoEnLocalStorage() {
    this.pedidoClienteService.guardarCarrito(this.productosCarrito);
  }
    
  
    
    
    
    
}

  


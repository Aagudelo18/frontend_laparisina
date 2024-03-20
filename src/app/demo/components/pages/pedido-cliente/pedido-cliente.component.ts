import { Component, OnInit } from '@angular/core';
import { PedidoClienteService } from './pedido-cliente.service';
import { FormGroup, FormBuilder, FormControl,Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
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
    aumento_empresa: number = 0;
    productosCarrito: any[] = [];
    cliente: any;
    productosSeleccionados: any[] = [];
    tipoEntrega = ['Domicilio', 'Recoger en Tienda']
    metodoPago = ['Transferencia', 'Efectivo'];
    totalCarrito: number = 0;
    minDate: Date = new Date();
    currentUser: any [];
    resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
    tipoCliente: string;
    ciudades : any = [];
    quienRecibe: string;
    private subscription: Subscription;

    constructor(
        
        private pedidoClienteService: PedidoClienteService,
        private fb: FormBuilder,
        private pr: FormBuilder,
        private messageService: MessageService,
        private LayoutService: LayoutService,
        
       
        private router: Router,
    ) {

        this.subscription = this.LayoutService.DeleteProdutCarView.subscribe(event => {
            this.eliminarProductoCarrito(event);
          });

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
            tipo_entrega: ['', Validators.required],
            subtotal_venta: ['', Validators.required], 
            precio_total_venta: ['', Validators.required], 
            valor_domicilio: [0, [Validators.required, Validators.min(0)]],
            nit_empresa_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            nombre_juridico: ['', Validators.required],
            aumento_empresa: [0, Validators.min(0)],
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
        this.obtenerTransportesActivos();
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        this.obtenerDatosCliente(currentUser.correo_electronico);
        this.obtenerProductosCarritoLocalStorage();
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
                    this.tipoCliente = data.tipo_cliente;

                    this.cliente = data;
                    this.pedido.patchValue({
                        tipo_cliente: data.tipo_cliente,
                        nombre_contacto: data.nombre_contacto,
                        documento_cliente: data.numero_documento_cliente,
                        quien_recibe: data.quien_recibe,
                        ciudad_cliente: data.ciudad_cliente,
                        barrio_cliente: data.barrio_cliente,
                        direccion_entrega: data.direccion_cliente,
                        telefono_cliente: data.telefono_cliente,
                        nit_empresa_cliente: data.nit_empresa_cliente,
                        nombre_juridico: data.nombre_juridico,
                        tipo_entrega: data.tipo_entrega,
                        estado_pago: data.estado_pago,

                        // Otros campos del formulario según los datos del cliente...
                    });
                    this.seleccionCiudad();

                    localStorage.setItem('documento_cliente', data.numero_documento_cliente);
                    this.calculoPrecioTotal();
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


calcularPrecioTotalVentaPersonaJuridica() {
    const subTotal = this.calcularSubtotal();
    const valor_domicilio = this.pedido.get('valor_domicilio').value || 0;
    const precioTotalVenta = subTotal + this.aumento_empresa + valor_domicilio;
    this.pedido.get('subtotal_venta').setValue(subTotal);
    this.pedido.get('precio_total_venta').setValue(precioTotalVenta);
}

calcularPrecioTotalVentaPersonaNatural() {
    const subTotal = this.calcularSubtotal();
    const valor_domicilio = this.pedido.get('valor_domicilio').value || 0;
    const precioTotalVenta = subTotal + valor_domicilio;
    this.pedido.get('subtotal_venta').setValue(subTotal);
    this.pedido.get('precio_total_venta').setValue(precioTotalVenta);
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

        
    // Validar el total del carrito
    if (this.calcularSubtotal() < 35000) {
        this.messageService.add({
            severity: 'warn',
            summary: 'El pedido mínimo es de $35.000',
            life: 5000
        });
        return;
    }

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
    // Validación específica para tipo de cliente "Persona natural"
    if (this.cliente.tipo_cliente === 'Persona natural' && this.pedido.get('quien_recibe').invalid) {
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
    if (this.pedido.get('tipo_entrega').invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El metodo tipo de entrega es requerida.' });
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
            ciudad_cliente: this.pedido.get('ciudad_cliente').value,
            barrio_cliente: this.pedido.get('barrio_cliente').value,
            direccion_entrega: this.pedido.get('direccion_entrega').value,
            fecha_entrega_pedido: fechaEntregaPedido.toISOString().substring(0, 10),
            metodo_pago: this.pedido.get('metodo_pago').value,
            subtotal_venta: this.calcularSubtotal(),
            precio_total_venta: this.pedido.get('precio_total_venta').value,
            estado_pago: 'Pendiente',
            tipo_entrega: this.pedido.get('tipo_entrega').value,
            valor_domicilio: this.pedido.get('valor_domicilio').value,
            aumento_empresa: this.calcularSubtotal() * 0.08,
            quien_recibe: this.cliente.tipo_cliente == 'Persona natural' ?  this.pedido.get('quien_recibe').value: null,
            nit_empresa_cliente: this.cliente.tipo_cliente == 'Persona jurídica' ?  this.cliente.nit_empresa_cliente : null,
            nombre_juridico: this.cliente.tipo_cliente == 'Persona jurídica' ? this.cliente.nombre_juridico: null,
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
          // Actualizar los valores de subtotal, aumento empresa y precio total
        this.calculoPrecioTotal();
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
    
  
    obtenerTransportesActivos(){
        this.pedidoClienteService.obtenerTransporteActivos().subscribe(
            (data) => {
                console.log(data)
                this.ciudades=data;
            });
    }
    
    seleccionCiudad(){
      
        if(this.pedido.get('tipo_entrega').value == 'Domicilio'){
            let ciudad = this.ciudades.find(ciudad => ciudad.ciudad_cliente == this.pedido.get('ciudad_cliente').value);
            this.pedido.get('valor_domicilio')?.setValue(ciudad.precio_transporte);
        }else {
            this.pedido.get('valor_domicilio')?.setValue(0); 
        }
       
       this.calculoPrecioTotal();
}


calculoPrecioTotal() {
    if (this.cliente.tipo_cliente === 'Persona jurídica') {
        this.aumento_empresa = this.calcularSubtotal() * 0.08;
        this.pedido.get('aumento_empresa').setValue(this.aumento_empresa);
        this.calcularPrecioTotalVentaPersonaJuridica();
    } else if (this.cliente.tipo_cliente === 'Persona natural') {
        this.calcularPrecioTotalVentaPersonaNatural();
    }
}




 
}

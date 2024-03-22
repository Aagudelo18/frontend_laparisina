import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidosService } from './pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './pedidos.model';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';


@Component({
    selector: 'app-list-pedidos',
    templateUrl: './list-pedidos.component.html',
    styleUrls: ['./list-pedidos.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ListPedidosComponent implements OnInit {


    bloquearGuardar: boolean = false;
    confirmacionEditarEstadoPago: boolean = false;
    editarEstadoPagoDialog: boolean = false;
    formEditarEstadoPago: FormGroup;
    pedidoSeleccionado: Pedido;
 
    listaEstadosPedido=['Terminado','Entregado']
    listaEstadosPago=['Pagado','Pendiente']
   
    pedidos: Pedido[] = [];
    selectedPedidos: Pedido[] = [];
    detallePedidoDialog: boolean = false;
    selectedPedidoId: string;
    pedido: any = {};
    id: string = '';
    formPedidos: FormGroup;
    roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
    estadoSiguiente: string;
    //vistas de listar pedidos array
    pedidosPendientes: Pedido[] = [];
    pedidosTerminados: Pedido[] = [];
    pedidosAnulados: Pedido[] = [];
    pedidosEnviados: Pedido[] = [];
    pedidosEntregados: Pedido[] = [];
    pestanaSeleccionada: number = 0; // 0 para pedidos pendientes, 1 para pedidos terminados
    cambiarEstadoPDialog: boolean;
    estado_pedido: string;
    estado_pago: string;
    realizarCambioEstado: boolean;
    resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
    cambiarEstadoPDialogAnular: boolean;
    cambiarEstadoPDialogEstadoPago:boolean;
    asignarDomiciliarioDialog: boolean = false;
    domiciliarioSeleccionado: any = '0'; // Puedes ajustar este tipo según tus necesidades
    domiciliarios: any; // Puedes cargar los domiciliarios desde tu servicio
    confirmarAsignacionDialog: boolean = false;
    pedidoPagado: boolean;
 


    constructor(
        private pedidosService: PedidosService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.formPedidos = this.fb.group({
            documento_cliente: [''],
            tipo_cliente: [''],
            nombre_contacto: [''],
            telefono_cliente: [''],
            quien_recibe: [''],
            ciudad_cliente: [''],
            barrio_cliente: [''],
            fecha_entrega_pedido: [''],
            fecha_pedido_tomado: [''],
            direccion_entrega: [''],
            estado_pedido: [''],
            precio_total_venta: [''],
            subtotal_venta: [''],
            metodo_pago: [''],
            estado_pago: [''],
            valor_domicilio: [''],
            tipo_entrega: [''],
            nit_empresa_cliente: [''],
            nombre_juridico: [''],
            aumento_empresa: [''],
            detalle_pedido: [''],
            domiciliario: [''],
        });
    }
    idPedidoSeleccionado: string;

    ngOnInit() {
        this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
            this.pedidos = data;
            console.log(this.pedidos);
        });
        this.cargarDomiciliarios();
        this.cargarPedidosPendientes();
        this.cargarPedidosTerminados();
        this.cargarPedidosAnulados();
        this.cargarPedidosEnviados();
        this.cargarPedidosEntregados();
    }

    //cargar el componet automatico
    reloadComponent() {
        const currentRoute = this.router.url;
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate([currentRoute]);
            });
    }

    //Cambiar de pestañas en el listar ----------------------------------------------------------------
    cambiarPestana(event) {
        this.pestanaSeleccionada = event.index;
    }

    //Cargar los pedidos-----------------------------------------------------------------------------
    cargarPedidosPendientes() {
        this.pedidosService
            .getPedidosPendientes()
            .subscribe((data: Pedido[]) => {
                this.pedidosPendientes = data;
                console.log(this.pedidosPendientes);
            });
    }

    cargarPedidosTerminados() {
        this.pedidosService
            .getPedidosTerminados()
            .subscribe((data: Pedido[]) => {
                this.pedidosTerminados = data;
                console.log(this.pedidosTerminados);
            });
    }

    cargarPedidosAnulados() {
        this.pedidosService.getPedidosAnulados().subscribe((data: Pedido[]) => {
            this.pedidosAnulados = data;
            console.log(this.pedidosAnulados);
        });
    }

    cargarPedidosEnviados() {
        this.pedidosService.getPedidosEnviados().subscribe((data: Pedido[]) => {
            this.pedidosEnviados = data;
            console.log(this.pedidosEnviados); // Agrega esta línea
        });
    }

    
    cargarPedidosEntregados() {
        this.pedidosService
            .getPedidosEntregadosConPagoPendiente()
            .subscribe((data: Pedido[]) => {
                this.pedidosEntregados = data;
                console.log(this.pedidosEntregados);
            });
    }


    openNewPedidos() {
        this.router.navigate(['/new-pedidos']);
    }

    enviarListPedido() {
        this.router.navigate(['/list-pedidos']);
    }

    verDetallePedido(id: string) {
        this.id = id;
        this.detallePedidoDialog = true;
        this.getPedidoDetalle(id);
    }

    getPedidoDetalle(id: string) {
        this.pedidosService.getPedidoDetalle(id).subscribe((data) => {
            let aumento = data.subtotal_venta * 0.08;
            this.formPedidos.setValue({
                documento_cliente: data.documento_cliente,
                tipo_cliente: data.tipo_cliente,
                nombre_contacto: data.nombre_contacto,
                telefono_cliente: data.telefono_cliente,
                quien_recibe: data.quien_recibe,
                direccion_entrega: data.direccion_entrega,
                barrio_cliente: data.barrio_cliente,
                fecha_entrega_pedido: data.fecha_entrega_pedido,
                fecha_pedido_tomado: data.fecha_pedido_tomado,
                ciudad_cliente: data.ciudad_cliente,
                estado_pedido: data.estado_pedido,
                precio_total_venta: data.precio_total_venta,
                subtotal_venta: data.subtotal_venta,
                metodo_pago: data.metodo_pago,
                estado_pago: data.estado_pago,
                tipo_entrega: data.tipo_entrega,
                valor_domicilio: data.valor_domicilio,
                aumento_empresa: aumento || '',
                nit_empresa_cliente: data.nit_empresa_cliente || '',
                nombre_juridico: data.nombre_juridico || '',
                detalle_pedido: data.detalle_pedido || [],
                domiciliario: '',
            });
            this.getDomiciliario(data.empleado_id);
        });
    }

    prueba(){
        console.log(this.domiciliarioSeleccionado)
    }

    getDomiciliario(id) {
        this.pedidosService.getDomiciliariosXId(id).subscribe((data) => {
            console.log(data);
            this.formPedidos.controls['domiciliario'].setValue(
                data.nombre_empleado
            );
        });
    }

    esPersonaNatural() {
        return this.formPedidos.get('tipo_cliente').value === 'Persona natural';
    }

    esEmpresa() {
        return (
            this.formPedidos.get('tipo_cliente').value === 'Persona jurídica'
        );
    }

    pendiente(id_pedido: string) {
        console.log("El id:", id_pedido);
        const pedido = this.pedidos.find(pedido => pedido._id === id_pedido); // Buscar el pedido por su _id
        if (pedido.estado_pago === 'Pagado') {
            this.pedidoPagado = true;
        } else {
            this.pedidoPagado = false;
        }
    }
    

    private esperarRespuesta(): Promise<boolean> {
        return new Promise<boolean>((resolver) => {
            this.resolverPromesa = resolver;
        });
    }

    // Añade la lógica para abrir el diálogo
    async abrirModal(id: string, estado_pedido: any) {
        this.estado_pedido = estado_pedido;
        this.cambiarEstadoPDialog = true;

        // Espera hasta que se resuelva la promesa
        const respuesta = await this.esperarRespuesta();

        // Ahora puedes usar la respuesta como necesites
        if (respuesta) {
            this.cambiarPedido(id, estado_pedido);
        } else {
            // Lógica si la respuesta es "No"
        }
    }

    // Actualiza el método para manejar el botón "Sí"
    onYesButtonClick() {
        this.resolverPromesa(true); // Resuelve la promesa con "true"
        this.cambiarEstadoPDialog = false; // Esto cerrará el diálogo automáticamente
    }

    // Actualiza el método para manejar el botón "No"
    onNoButtonClick() {
        this.resolverPromesa(false); // Resuelve la promesa con "false"
        this.cambiarEstadoPDialog = false; // Esto cerrará el diálogo automáticamente
    }

    cambiarPedido(id: string, estado_pedido: any) {
        const pedido = this.pedidos.find((pedido) => pedido._id === id)
        // Si el pedido está en el estado "Pendiente", establece el estado siguiente
        if (estado_pedido === 'Pendiente') {
            pedido.estado_pedido = 'Tomado';
        } else if (estado_pedido == 'Tomado') {
            pedido.estado_pedido = 'En producción';
        } else if (estado_pedido == 'Terminado') {
            pedido.estado_pedido = 'Enviado';
        }


        // Pasa el pedido al método updatePedido()
        this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
            (response) => {
                let successMessage = '';
                if (estado_pedido === 'Pendiente') {
                    successMessage = 'Cambio de estado a "Tomado" con éxito';
                } else if (estado_pedido == 'Tomado') {
                    successMessage = 'El pedido se envió a Orden de Producción con éxito';
                }

    
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cambio de estado con Éxito',
                    detail: successMessage,
                    life: 5000,
                });
                // Actualizar la lista de pedidos
                this.cargarPedidosPendientes();
                this.cargarPedidosTerminados();
                this.cargarPedidosEnviados();
            },
            (error) => {
                if (error.error && error.error.error) {
                    const errorMessage = error.error.error;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al cambiar el estado del Pedido',
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
        this.cambiarEstadoPDialog = false;
    }

    

    // Añade la lógica para abrir el diálogo
    async cambiarEstadoPago(id: string) {
        const pedido = this.pedidos.find((pedido) => pedido._id === id);
    
        // Verifica si el estado del pedido es "Pendiente" antes de abrir el diálogo de anulación
        if (pedido.estado_pago === 'Pendiente') {
            this.cambiarEstadoPDialogEstadoPago = true;
            const respuesta = await this.esperarRespuesta();
            if (respuesta) {
                // Cambia el estado del pedido a "Anulado"
                pedido.estado_pago = 'Pagado';
                // Actualiza el pedido en el backend
                this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
                    (response) => {
                        // Muestra un mensaje de éxito
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Cambio de Estado a Pagado exitosamente',
                            life: 5000,
                        });
    
                        // Actualiza la lista de pedidos pendientes
                        this.cargarPedidosEntregados();
                    },
                    (error) => {
                        // Muestra un mensaje de error si hay algún problema al actualizar el pedido
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al Cambiar el estado del Pago',
                            detail: 'Ocurrió un error al cambiar el esatdo del pago. Por favor, inténtalo de nuevo.',
                            life: 5000,
                        });
                        console.error('Error al anular el pedido:', error);
                    }
                );
            } else {
                // Lógica si la respuesta es "No"
            }
        } else {
            // Si el estado no es "Pendiente", muestra un mensaje de error
            this.messageService.add({
                severity: 'error',
                summary: 'Error al cambiar el estado de pago',
                detail: 'El estado de pago solo se puede cambiar si esta en "Pendiente".',
                life: 5000,
            });
        }
    }
    
        // Actualiza el método para manejar el botón "Sí"
        onYesButtonClickEstadoPago() {
            this.resolverPromesa(true); 
            this.cambiarEstadoPDialogEstadoPago = false; 
        }

        // Actualiza el método para manejar el botón "No"
        onNoButtonClickEstadoPago() {
            this.resolverPromesa(false); 
            this.cambiarEstadoPDialogEstadoPago = false; 
        }
    

    // Añade la lógica para abrir el diálogo
    async abrirModalAnular(id: string) {
        const pedido = this.pedidos.find((pedido) => pedido._id === id);
    
        // Verifica si el estado del pedido es "Pendiente" antes de abrir el diálogo de anulación
        if (pedido.estado_pedido === 'Pendiente') {
            // Si el estado es "Pendiente", abre el diálogo
            this.cambiarEstadoPDialogAnular = true;
    
            // Espera hasta que se resuelva la promesa
            const respuesta = await this.esperarRespuesta();
    
            // Ahora puedes usar la respuesta como necesites
            if (respuesta) {
                // Cambia el estado del pedido a "Anulado"
                pedido.estado_pedido = 'Anulado';
    
                // Actualiza el pedido en el backend
                this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
                    (response) => {
                        // Muestra un mensaje de éxito
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Pedido anulado exitosamente',
                            life: 5000,
                        });
    
                        // Actualiza la lista de pedidos pendientes
                        this.cargarPedidosPendientes();
                    },
                    (error) => {
                        // Muestra un mensaje de error si hay algún problema al actualizar el pedido
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al anular el pedido',
                            detail: 'Ocurrió un error al anular el pedido. Por favor, inténtalo de nuevo.',
                            life: 5000,
                        });
                        console.error('Error al anular el pedido:', error);
                    }
                );
            } else {
                // Lógica si la respuesta es "No"
            }
        } else {
            // Si el estado no es "Pendiente", muestra un mensaje de error
            this.messageService.add({
                severity: 'error',
                summary: 'Error al anular el pedido',
                detail: 'El pedido solo se puede anular en estado "Pendiente".',
                life: 5000,
            });
        }
    }
    
    

    // Actualiza el método para manejar el botón "Sí"
    onYesButtonClickAnular() {
        this.resolverPromesa(true); // Resuelve la promesa con "true"
        this.cambiarEstadoPDialogAnular = false; // Esto cerrará el diálogo automáticamente
    }

    // Actualiza el método para manejar el botón "No"
    onNoButtonClickAnular() {
        this.resolverPromesa(false); // Resuelve la promesa con "false"
        this.cambiarEstadoPDialogAnular = false; // Esto cerrará el diálogo automáticamente
    }

    cambiarPedidoAnular(id: string) {
        const pedido = this.pedidos.find((pedido) => pedido._id === id);
        console.log(pedido);
        pedido.estado_pedido = 'Anulado';
        // Pasa el pedido al método updatePedido()
        this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cambio de estado con Éxito',
                    life: 5000,
                });
                // Actualizar la lista de pedidos
                this.cargarPedidosPendientes();
                this.cargarPedidosTerminados();
                this.reloadComponent();
            },
            (error) => {
                if (error.error && error.error.error) {
                    const errorMessage = error.error.error;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al cambiar el estado del Pedido',
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
        this.cambiarEstadoPDialogAnular = false;
    }

    esPedidoPendiente(pedido: any): boolean {
        return pedido.estado_pedido === 'Pendiente';
    }
    
    
    esPedidoEstadoPago(pedido: any): boolean {
        return pedido.estado_pedido === 'Entregado' && pedido.estado_pago === 'Pendiente';
      }
      

    async abrirModalDomicilio(id: string, estado_pedido: string) {
        this.idPedidoSeleccionado = id; // Guarda el ID del pedido seleccionado
        this.asignarDomiciliarioDialog = true;
        this.cargarDomiciliarios();

        
        // Espera hasta que se resuelva la promesa
        const respuesta = await this.esperarRespuesta();

        // Ahora puedes usar la respuesta como necesites
        if (respuesta) {
            this.cambiarPedido(id, estado_pedido);
            this.confirmarAsignacionDialog = true;
        } else {
            // Lógica si la respuesta es "No"
            this.confirmarAsignacionDialog = false;
        }
    }

    onYesButtonClickDomicilio() {
        if(this.domiciliarioSeleccionado == '0'){
            this.messageService.add({
                severity: 'error',
                summary: 'Debe de seleccionar un domiciliario',
                life: 5000,
            });
            return;
        }
    
        // Abre el modal de confirmación sobre el modal de seleccionar domiciliario
        this.confirmarAsignacionDialog = true;
    }
    // Actualiza el método para manejar el botón "No"
    onNoButtonClickDomicilio() {
        this.resolverPromesa(false); // Resuelve la promesa con "false"
        this.asignarDomiciliarioDialog = false; // Esto cerrará el diálogo automáticamente
    }

    cargarDomiciliarios() {
        this.pedidosService.getDomiciliarios().subscribe((data: any[]) => {
            this.domiciliarios = data;
            console.log('Domiciliarios cargados:', this.domiciliarios);
        });
    }

    asignarPedidoADomiciliario(idPedido: string, idDomiciliario: string) {
        console.log(
            'ID del pedido y del domiciliario:',
            idPedido,
            idDomiciliario
        );

        this.pedidosService
            .asignarPedidoDomiciliario(idPedido, idDomiciliario)
            .subscribe(
                (response: any) => {
                    // Manejar la respuesta del servidor
                    console.log(response);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cambio de estado con Éxito a "Enviado"',
                        life: 5000,
                    });

                    // Actualizar la lista de pedidos terminados
                    this.cargarPedidosTerminados();

                    // Cierra los modales
                    this.confirmarAsignacionDialog = false;
                    this.asignarDomiciliarioDialog = false;
                },
                (error) => {
                    // Manejar errores
                    if (error.error && error.error.error) {
                        const errorMessage = error.error.error;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al cambiar el estado del Pedido',
                            detail: errorMessage,
                            life: 5000,
                        });
                    } else {
                        console.error(
                            'Error desconocido al asignar el Pedido:',
                            error
                        );
                    }
                }
            );
    }

    confirmarAsignacion(confirmacion: boolean) {
        if (confirmacion) {
            // Resuelve la promesa con "true"
            this.resolverPromesa(true);
            console.log('Domiciliario seleccionado:', this.domiciliarioSeleccionado);
    
            // Asigna el pedido al domiciliario
            this.asignarPedidoADomiciliario(
                this.idPedidoSeleccionado,
                this.domiciliarioSeleccionado
            );
        } else {
            // Lógica si la respuesta es "No"
            // Vuelve a abrir el modal de asignación de domiciliario para seleccionar otro domiciliario
            
            this.asignarDomiciliarioDialog = true;
        }
    
        // Cierra el modal de confirmación
        this.confirmarAsignacionDialog = false;
        

    }



    // Función para filtrar la tabla en el buscador
    onGlobalFilter(table: Table, event: Event, filterType: string) {
        // Filtrar la tabla según el tipo
        switch (filterType) {
            case 'Pendientes':
            case 'Terminados':
            case 'Enviados':
            case 'Anulados':
                table.filterGlobal(
                    (event.target as HTMLInputElement).value,
                    'contains'
                );
                break;
        }
    }

    abrirModalEditarEstadoYPago(id: string) {
        this.obtenerPedido(id);
        this.pendiente(id);
    }

    async obtenerPedido(id: string) {
        try {
            const pedido = await this.pedidosService.getPedidoDetalle(id).toPromise();
            if (pedido) {
                this.pedidoSeleccionado = pedido;
                this.actualizarFormularioConPedido();
                
                this.editarEstadoPagoDialog = true;
            } else {
                console.error('El pedido no se encontró.');
            }
        } catch (error) {
            console.error('Error al obtener los detalles del pedido:', error);
        }
    }

    actualizarFormularioConPedido() {
        this.formPedidos.patchValue({
            estado_pedido: this.pedidoSeleccionado.estado_pedido,
            estado_pago: this.pedidoSeleccionado.estado_pago,
        });
    }
// Método para actualizar el pedido
async actualizarPedido() {
    try {
        if (this.pedidoSeleccionado) {
            const estadoPedido = this.formPedidos.get('estado_pedido').value;
            const estadoPago = this.formPedidos.get('estado_pago').value;

            const pedidoActualizado: Pedido = {
                ...this.pedidoSeleccionado,
                estado_pedido: estadoPedido,
                estado_pago: estadoPago,
            };

             // Verificar si se han realizado cambios
            //  const cambiosRealizados = 
            //  estadoPedido !== this.pedidoSeleccionado.estado_pedido ||
            //  estadoPago !== this.pedidoSeleccionado.estado_pago;

            //  if (!cambiosRealizados) {
            //     // Si no se han realizado cambios, bloquear el botón de guardar y salir
            //     this.bloquearGuardar = true;
            //     return;
            // }
            // Actualizamos el pedido
            await this.pedidosService.updatePedido(this.pedidoSeleccionado._id, pedidoActualizado).toPromise();

            let successMessage = '';
            // Determinar el mensaje de éxito según los cambios realizados
            if (estadoPedido && estadoPago) {
                successMessage = 'Estado y Método de Pago Actualizados Exitosamente';
            } else if (estadoPedido) {
                successMessage = 'Estado del Pedido Actualizado Exitosamente';
            } else if (estadoPago) {
                successMessage = 'Estado de Pago Actualizado Exitosamente';
            }

            // Mostrar mensaje de éxito si se realizó algún cambio
            if (successMessage) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cambio de Estado con Éxito',
                    detail: successMessage,
                    life: 5000,
                });
            }
        

        } else {
            console.error('El pedido seleccionado no está definido.');
        }
    } catch (error) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error al Actualizar Estado y Método de Pago',
            detail: 'Ocurrió un error al actualizar el estado y el método de pago. Por favor, inténtalo de nuevo.',
            life: 5000,
        });
        console.error('Error al guardar los cambios:', error);
    }
}



// Método para cerrar el modal de edición
cerrarModalEditarEstadoYPago() {
    this.editarEstadoPagoDialog = false;
  
}

// Método para mostrar el modal de confirmación
confirmarEdicionPedido() {
    // Si confirma la edición, muestra el modal de confirmación
    this.confirmacionEditarEstadoPago = true;
}

// Método para manejar el botón "Sí" del modal de confirmación
confirmarCambiosEstado() {
    // Aquí puedes agregar lógica adicional si es necesario antes de actualizar el pedido
    this.actualizarPedido(); // Llama a la función para actualizar el pedido
    this.confirmacionEditarEstadoPago = false; // Cierra el modal de confirmación
    this.editarEstadoPagoDialog = false; // Cierra el modal de edición
    // Mostramos el mensaje de éxito

    
}

// Método para manejar el botón "No" del modal de confirmación
cancelarCambiosEstado() {
    this.confirmacionEditarEstadoPago = false; // Cierra el modal de confirmación sin realizar cambios
}

// bloquearEditarEstado() {
//     // Verifica si hay cambios en los estados
//     const cambiosEstado = this.formPedidos.get('estado_pedido').dirty || this.formPedidos.get('estado_pago').dirty;
    
//     // Desbloquea el botón de guardar si hay cambios
//     this.bloquearGuardar = !cambiosEstado;
// }



}
    
    


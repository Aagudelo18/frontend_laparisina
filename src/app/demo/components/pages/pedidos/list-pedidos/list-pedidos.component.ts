import { Component, OnInit } from '@angular/core';
import { PedidosService } from './pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './pedidos.model';
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
    realizarCambioEstado: boolean;
    resolverPromesa: (value: boolean | PromiseLike<boolean>) => void;
    cambiarEstadoPDialogAnular: boolean;
    asignarDomiciliarioDialog: boolean = false;
    domiciliarioSeleccionado: any; // Puedes ajustar este tipo según tus necesidades
    domiciliarios: any; // Puedes cargar los domiciliarios desde tu servicio

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
            valor_domicilio: [''],
            nit_empresa_cliente: [''],
            nombre_juridico: [''],
            aumento_empresa: [''],
            detalle_pedido: [''],
        });
    }

    ngOnInit() {
        this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
            this.pedidos = data;
        });
        this.cargarDomiciliarios();
        this.cargarPedidosPendientes();
        this.cargarPedidosTerminados();
        this.cargarPedidosAnulados();
        this.cargarPedidosEnviados();
        this.cargarPedidosEntregados();
    }

    //Cargar Domiciliarios
    cargarDomiciliarios() {
        this.pedidosService.getDomiciliarios().subscribe((data: Pedido[]) => {
            this.domiciliarios = data;
            console.log(this.domiciliarios);
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

    
    cargarPedidosEntregados() {
        this.pedidosService
            .getPedidosEntregados()
            .subscribe((data: Pedido[]) => {
                this.pedidosEntregados = data;
                console.log(this.pedidosEntregados);
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
                valor_domicilio: data.valor_domicilio,
                aumento_empresa: aumento || '',
                nit_empresa_cliente: data.nit_empresa_cliente || '',
                nombre_juridico: data.nombre_juridico || '',
                detalle_pedido: data.detalle_pedido || [],
            });
        });
    }

    esPersonaNatural() {
        return this.formPedidos.get('tipo_cliente').value === 'Persona natural';
    }

    esEmpresa() {
        return this.formPedidos.get('tipo_cliente').value === 'Empresa';
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
        const pedido = this.pedidos.find((pedido) => pedido._id === id);
        console.log(pedido);
        // Si el pedido está en el estado "Pendiente", establece el estado siguiente
        if (estado_pedido === 'Pendiente') {
            pedido.estado_pedido = 'Tomado';
        } else if (estado_pedido == 'Tomado') {
            pedido.estado_pedido = 'Pendiente en produccion';
        }

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
    async abrirModalAnular(id: string) {
        this.cambiarEstadoPDialogAnular = true;

        // Espera hasta que se resuelva la promesa
        const respuesta = await this.esperarRespuesta();

        // Ahora puedes usar la respuesta como necesites
        if (respuesta) {
            this.cambiarPedidoAnular(id);
        } else {
            // Lógica si la respuesta es "No"
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

    // Añade la lógica para abrir el diálogo
    async abrirModalDomicilio(id: string) {
        this.asignarDomiciliarioDialog = true;

        // Espera hasta que se resuelva la promesa
        const respuesta = await this.esperarRespuesta();

        // Ahora puedes usar la respuesta como necesites
        if (respuesta) {
            this.enviarDomicilio(id);
        } else {
            // Lógica si la respuesta es "No"
        }
    }


   
    // Actualiza el método para manejar el botón "Sí"
    onYesButtonClickDomicilio() {
        this.resolverPromesa(true); // Resuelve la promesa con "true"
        this.asignarDomiciliarioDialog = false; // Esto cerrará el diálogo automáticamente
    }

    // Actualiza el método para manejar el botón "No"
    onNoButtonClickDomicilio() {
        this.resolverPromesa(false); // Resuelve la promesa con "false"
        this.asignarDomiciliarioDialog = false; // Esto cerrará el diálogo automáticamente
    }

    enviarDomicilio(id: string) {
        const pedido = this.pedidos.find((pedido) => pedido._id === id);
        console.log(pedido);
        // Si el pedido está en el estado "Pendiente", establece el estado siguiente
        pedido.estado_pedido = 'Enviado';
    
        // Pasa el pedido al método updatePedido()
        this.pedidosService.updatePedido(pedido._id, pedido).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cambio de estado con Éxito',
                    life: 5000,
                });
                // Actualizar la lista de pedidos
                this.cargarPedidosEnviados();
                this.cargarPedidosTerminados();
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
        this.asignarDomiciliarioDialog = false;
    }
}

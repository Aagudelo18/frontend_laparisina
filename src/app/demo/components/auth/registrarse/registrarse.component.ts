import { Component, OnInit } from '@angular/core';
import { ClienteService } from './clientes.service';
import { UsuarioService } from './usuarios.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RegistrarseService } from './registrarse.services';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from '../../pages/clientes/clientes.model';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';
import { Subject, Observable, throwError } from 'rxjs';


@Component({
    selector: 'app-registrarse',
    templateUrl: './registrarse.component.html',
    providers: [MessageService]
})
export class RegistrarseComponent implements OnInit {
    usuarios: any[] = [];
    crearClienteDialog: boolean = false;

    private confirmacionUsuarioSubject = new Subject<boolean>();
    mostrarConfirmacionUsuario = false;
    listClientes: Clientes[] = []
    clientes: Clientes = {}
    formCliente: FormGroup;
    id: string = '';


    estado: SelectItem[] = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    selectedEstado: SelectItem = { value: '' };


    constructor(
        public layoutService: LayoutService,
        private signInService: RegistrarseService,
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private router: Router,
        private aRouter: ActivatedRoute
    ) {
        this.formCliente = this.fb.group({
            tipo_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            nombre_contacto: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            nombre_juridico: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            numero_documento_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
            nit_empresa_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,12}$/),]],
            telefono_cliente: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
            direccion_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s,.'-]+$/),]],
            barrio_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            ciudad_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
            estado_cliente: ['', Validators.required],
            correo_cliente: ['', [Validators.required, Validators.email]],
            contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),]],
            confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
        })
        this.aRouter.params.subscribe(params => {
            this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
    }

    //Verifica o se asegura de que el campo de confirmar contraseña coincida con la contraseña.
    validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
        const contrasena = control.root.get('contrasena_usuario');
        const confirmarContrasena = control.value;

        if (contrasena && contrasena.value !== confirmarContrasena) {
            return { contrasenaNoCoincide: true };
        }
        return null;
    }

    ngOnInit(): void {
        this.getListClientes();
    }

    getListClientes() {
        this.clienteService.getListClientes().subscribe((data) => {
            this.listClientes = data;
        })
    }

    // Función para crear una categoría
    crearCliente() {
        const nuevoCliente: Clientes = {
            tipo_cliente: this.formCliente.value.tipo_cliente,
            nombre_contacto: this.formCliente.value.nombre_contacto,
            nombre_juridico: this.formCliente.value.nombre_juridico,
            numero_documento_cliente: this.formCliente.value.numero_documento_cliente,
            nit_empresa_cliente: this.formCliente.value.nit_empresa_cliente,
            correo_cliente: this.formCliente.value.correo_cliente,
            telefono_cliente: this.formCliente.value.telefono_cliente,
            direccion_cliente: this.formCliente.value.direccion_cliente,
            barrio_cliente: this.formCliente.value.barrio_cliente,
            ciudad_cliente: this.formCliente.value.ciudad_cliente,
            estado_cliente: true,
        };

        const nuevoUsuario = {
            correo_electronico: this.formCliente.value.correo_cliente,
            contrasena_usuario: this.formCliente.value.contrasena_usuario,
            confirmar_contrasena: this.formCliente.value.confirmar_contrasena,
        };

        // Verifica la igualdad de contraseñas antes de enviar la solicitud para crear el usuario
        if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
            this.confirmarCrearUsuario().subscribe(
                (usuarioConfirmado) => {
                    if (usuarioConfirmado) {
                        // El usuario fue confirmado, ahora puedes crear el cliente
                        this.clienteService.postClientes(nuevoCliente).subscribe(
                            () => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Se registró la cuenta con éxito',
                                    detail: 'Cliente creado',
                                    life: 6000,
                                });
                                this.getListClientes();
                                this.crearClienteDialog = false;
                            },
                            (error) => {
                                console.error('Error al crear el cliente:', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error al crear la cuenta',
                                    detail: 'Error al crear el cliente',
                                    life: 3000,
                                });
                            }
                        );
                    } else {
                        // El usuario no fue confirmado, puedes manejarlo según tus necesidades
                        console.log('Error por no confirmar el usuario')
                    }
                },
                (error) => {
                    console.error('Error al confirmar el usuario:', error);
                    // Manejar errores al confirmar el usuario
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al registrar la cuenta',
                life: 3000,
            });
        }
    };

    confirmarCrearUsuario() {
        const nuevoUsuario = {
            correo_electronico: this.formCliente.value.correo_cliente,
            contrasena_usuario: this.formCliente.value.contrasena_usuario,
            confirmar_contrasena: this.formCliente.value.confirmar_contrasena,
        };

        if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
            this.mostrarConfirmacionUsuario = true;

            return new Observable<boolean>((observer) => {
                this.confirmacionUsuarioSubject.subscribe((respuesta) => {
                    this.mostrarConfirmacionUsuario = false;

                    if (respuesta) {
                        this.usuarioService.createUsuario(nuevoUsuario).subscribe(
                            () => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'El usuario fue creado con éxito',
                                    detail: 'Usuario creado',
                                    life: 3000
                                });
                                observer.next(true);  // Usuario creado exitosamente
                                observer.complete();
                            },
                            (error) => {
                                console.error('Error al confirmar el usuario:', error);
                                observer.error('Error al confirmar el usuario');
                            }
                        );
                    } else {
                        observer.next(false);  // Usuario no confirmado
                        observer.complete();
                    }
                });
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Las contraseñas no coinciden al confirmar',
                life: 3000,
            });
            return throwError('Las contraseñas no coinciden');
        }
    }

    confirmarCreacionUsuario() {
        this.mostrarConfirmacionUsuario = false;
        this.confirmacionUsuarioSubject.next(true); // Confirmar la creación del usuario
        this.router.navigate(['/auth/login']);
    }

    irALogin() {
        this.router.navigate(['/auth/login']); // Reemplaza '/ruta-del-login' con la ruta real de tu componente de login
    }

}

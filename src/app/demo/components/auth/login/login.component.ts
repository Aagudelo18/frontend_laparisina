import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from './login.services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],

    providers: [LoginService, MessageService]
})
export class LoginComponent implements OnInit {
    usuarios: any[] = [];
    valCheck: string[] = ['remember'];
    loginFormulario: FormGroup;
    correo_electronico: string = '';
    contrasena_usuario: string = '';
    correoNoRegistradoError: string | null = null; // Inicializa la variable como null
    isAuthenticated: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private loginService: LoginService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.loginFormulario = this.formBuilder.group({
            correo_electronico: ['', [Validators.required, Validators.email]], // Agrega Validators.email para validar el formato del correo electrónico
            contrasena_usuario: ['', Validators.required]
        });

    }

    ngOnInit() {
        this.getListUsuarios();
    }

    getListUsuarios() {
        this.loginService.getUsuarios().subscribe((data: any) => {
            if (data && data.usuarios) {
                this.usuarios = data.usuarios;
            }
        });
    }

    login() {
        if (this.loginFormulario.valid) {
            const usuarioData = this.loginFormulario.value;

            this.loginService.login(usuarioData).subscribe(
                (response: any) => {
                    if (response && response.usuario) {
                        //Guardar el usuario en local storage
                        localStorage.setItem('currentUser', JSON.stringify(response.usuario)); // Almacena los datos del usuario
                        // Guardar el token en localStorage
                        localStorage.setItem('token', response.token);
                        // Redirigir al usuario a la página después del inicio de sesión
                        this.router.navigate(['/']);
                    } else {
                        // En caso de inicio de sesión fallido, limpiar el token
                        localStorage.removeItem('token');
                        console.error('Inicio de sesión fallido.');
                    }
                },
                (error) => {
                    console.error('Error en la solicitud de inicio de sesión:', error);
                    localStorage.removeItem('token');

                    if (error.error && error.error.msg) {
                        this.correoNoRegistradoError = error.error.msg;
                    } else {
                        this.correoNoRegistradoError = 'Ha ocurrido un error, por favor intenta de nuevo';
                    }
                }
            );
        }
    }
}

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
                console.log(this.usuarios);
            }
        });
    }

    login() {
        if (this.loginFormulario.valid) {
            const usuarioData = this.loginFormulario.value;
            console.log('este es usuario data: ' + usuarioData);
            console.log(usuarioData);
            
            this.loginService.Login(usuarioData).subscribe(
                (response: any) => {
                    if (response && response.usuario) {
                        console.log(response);
                        console.log(response.usuario);
                        // Usuario autenticado correctamente
                        // Redirecciona a la página después del inicio de sesión (por ejemplo, /dashboard)
                        this.router.navigate(['/']);
                    } else {
                        // Autenticación fallida
                        console.error('Inicio de sesión fallido.');
                    }
                },
                (error) => {
                    console.error('Error en la solicitud de inicio de sesión:', error);

                    // Verifica si el error es un HTTP 400 y el mensaje indica que el correo electrónico no está registrado
                    
                }
            );
        }
    }
}

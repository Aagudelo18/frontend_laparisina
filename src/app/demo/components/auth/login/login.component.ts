import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from './login.services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';

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
    showPassword: boolean = false;

    correoCliente: string = '';


    constructor(
        public layoutService: LayoutService,
        private loginService: LoginService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.loginFormulario = this.formBuilder.group({
            correo_electronico: ['', [Validators.required, Validators.email]], // Agrega Validators.email para validar el formato del correo electrónico
            contrasena_usuario: ['', [Validators.minLength(6), Validators.required]]
        });
    }

    ngOnInit() {

    }
    //Metodo promesa Esperar a terminar
    async getRol(userRole: any, token: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.loginService.getRol(userRole, token).subscribe((response: any) => {
                const roleName = response?.nombre_rol; // Obtener el nombre del rol
                if (roleName) {
                    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Tiempo de expiración: una hora en milisegundos
                    localStorage.setItem('token', token);
                    localStorage.setItem('rol', roleName); // Almacena el nombre del rol
                    localStorage.setItem('expirationTime', expirationTime.toString());
                    this.loginService.setisAuthenticatedSubject(true);
                    // Eliminar el token después de una hora
                    setTimeout(() => {
                        console.log('eliminado');
                        localStorage.removeItem('token');
                        localStorage.removeItem('rol');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('expirationTime');
                        this.loginService.setisAuthenticatedSubject(false);
                        alert('Su tiempo de sesión se ha agotado, por favor inicie sesión.')
                    }, 60 * 60 * 1000 * 8); // 8 horas en milisegundos

                    resolve('');
                }
            })
        });
    }

    async login() {
        if (this.loginFormulario.valid) {
            const usuarioData = this.loginFormulario.value;
            this.loginService.login(usuarioData).subscribe(
                async (response: any) => {
                    if (response && response.usuario) {
                        const token = response?.token;
                        const userRole = response?.usuario?.rol_usuario; // Obtener el rol del usuario
                        if (token && userRole) {
                            await this.getRol(userRole, token);
                        }
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

                    this.correoCliente = response.usuario.correo_electronico
                    
                    this.actualizarCarritoSegunTipoCliente(this.correoCliente);
                    
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
        // this.layoutService.obtenerYActualizarDatosUsuario()
        
        
    }

    togglePasswordVisibility(controlName: string): void {
        const control = this.loginFormulario.get(controlName);
        if (control) {
            const inputField = document.getElementById(controlName) as HTMLInputElement;
            if (inputField) {
                inputField.type = this.showPassword ? 'password' : 'text';
                this.showPassword = !this.showPassword;
            }
        }
    }

    registro() {
        this.router.navigate(['/auth/registrarse']); // Navegar a la vista de registro al hacer clic en el botón
    }

    recuperarContrasena() {
        this.router.navigate(['/auth/recuperar-contrasena']); // Navegar a la vista de recuperar contraseña al hacer clic en el enlace
    }

    catalogo() {
        this.router.navigate(['/']); // Navegar a la vista de registro al hacer clic en el botón
    }

    actualizarCarritoSegunTipoCliente(correoCliente: string) {
        this.layoutService.actualizarCarritoAlIniciarSesion(correoCliente);
    }
}

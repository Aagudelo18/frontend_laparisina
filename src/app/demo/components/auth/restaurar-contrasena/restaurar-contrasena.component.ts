import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RestaurarContrasenaService } from './restaurar-contrasena.services';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-restaurar-contrasena',
    templateUrl: './restaurar-contrasena.component.html',
    providers: [MessageService]
})
export class RestaurarContrasenaComponent implements OnInit {
    correo_electronico: string = '';
    newPassword: string = '';
    token: string = '';
    formularioContrasena: FormGroup;
    // Lógica relacionada con la recuperación de contrasena
    // Puedes definir propiedades, métodos y lógica específica para recuperar contrasena aquí

    constructor(
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private resetPasswordService: RestaurarContrasenaService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.formularioContrasena = this.formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)]],
            confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
        });

        // Capturar el token de la URL usando ActivatedRoute
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || ''; // Obtener el token de los parámetros de la URL
            if (this.token) {
            }
        });
    }

    //Verifica o se asegura de que el campo de confirmar contraseña coincida con la contraseña.
    validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
        const contrasena = control.root.get('newPassword');
        const confirmarContrasena = control.value;

        if (contrasena && contrasena.value !== confirmarContrasena) {
            return { contrasenaNoCoincide: true };
        }

        return null;
    }

    restablecerContrasena() {
        const newPassword = this.formularioContrasena.value.newPassword;

        if (this.formularioContrasena.valid && this.token) {
            this.resetPasswordService.resetPassword(newPassword, this.token)
                .subscribe(
                    () => {
                        // Manejo del éxito
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Contraseña restablecida correctamente',
                            life: 3000
                        });
                        // Redirigir después de 3 segundos
                        setTimeout(() => {
                            this.router.navigate(['/auth/login']);
                        }, 3000);

                    },
                    (error) => {
                        // Manejo de errores
                        if (error.status === 400 && error.error.message === 'El token es inválido o ha expirado') {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'El token es inválido o ha expirado',
                                life: 3000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Ha ocurrido un error al restablecer la contraseña',
                                life: 3000
                            });
                            console.error('Error al restablecer la contraseña:', error);
                        }
                    }
                );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, completa el formulario correctamente',
                life: 3000
            });
        }
    }



    private resetPassword() {
        const newPassword = this.formularioContrasena.value.newPassword;
        console.log('Contraseña a enviar:', newPassword);
        this.resetPasswordService.resetPassword(newPassword, this.token)
            .subscribe(
                () => {
                    // Manejo del éxito
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Contraseña restablecida correctamente',
                        life: 3000
                    });
                    // Puedes redirigir al usuario a una página de éxito o a otra ruta aquí
                    // Ejemplo:
                    // this.router.navigate(['/login']);
                },
                (error) => {
                    // Manejo de errores
                    if (error.status === 400 && error.error.message === 'El token es inválido o ha expirado') {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'El token es inválido o ha expirado',
                            life: 3000
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Ha ocurrido un error al restablecer la contraseña',
                            life: 3000
                        });
                        console.error('Error al restablecer la contraseña:', error);
                        console.log(newPassword)
                    }
                }
            );
    }

}
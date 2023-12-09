import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RecuperarContrasenaService } from './recuperar-contrasena.services';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-recuperar-contrasena',
    templateUrl: './recuperar-contrasena.component.html',
    providers: [MessageService]
})
export class RecuperarContrasenaComponent implements OnInit {
    usuarios: any[] = [];
    correoElectronico: string = '';
    formularioCorreo: FormGroup;
    // Lógica relacionada con la recuperación de contrasena
    // Puedes definir propiedades, métodos y lógica específica para recuperar contrasena aquí

    constructor(
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private resetPasswordService: RecuperarContrasenaService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.formularioCorreo = this.formBuilder.group({
            correo_electronico: ['', [Validators.required, Validators.email]]
        });
    }

    enviarCorreo() {
        if (this.formularioCorreo.valid) {
            const correoElectronico = this.formularioCorreo.get('correo_electronico').value;
            this.resetPasswordService.forgotPassword(correoElectronico).pipe(
                catchError(error => {
                    if (error.status === 404 && error.error && error.error.message) {
                        const errorMessage = error.error.message;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errorMessage,
                            life: 5000
                        });
                    } else {
                        console.error('Error al solicitar el restablecimiento de la contraseña:', error);
                    }
                    return throwError(error); // Propaga el error
                })
            ).subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.',
                        life: 4000
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, ingresa un correo electrónico válido.',
                life: 4000
            });
        }
    }

}

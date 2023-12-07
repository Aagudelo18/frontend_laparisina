import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RecuperarContrasenaService } from './recuperar-contrasena.services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa Validators y FormGroup
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-recuperar-contrasena',
    templateUrl: './recuperar-contrasena.component.html',
})
export class RecuperarContrasenaComponent implements OnInit {
    usuarios: any[] = [];
    // Lógica relacionada con la recuperación de contrasena
    // Puedes definir propiedades, métodos y lógica específica para recuperar contrasena aquí

    constructor(
        public layoutService: LayoutService,
        private resetPasswordService: RecuperarContrasenaService,
    ) {
    }

    ngOnInit() {
        this.getListUsuarios();
    }

    getListUsuarios() {
        this.resetPasswordService.getUsuarios().subscribe((data: any) => {
            if (data && data.usuarios) {
                this.usuarios = data.usuarios;
                console.log(this.usuarios);
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { NewEmpleadosService } from './new-empleados.service';
import { UsuarioService } from '../../usuarios/usuarios.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-new-empleados',
    templateUrl: './new-empleados.component.html',
    styleUrls: ['./new-empleados.component.scss'],
    providers: [MessageService],
})
export class NewEmpleadosComponent implements OnInit {
    

    constructor(
      private usuarioService :UsuarioService,
        private newempleadosService: NewEmpleadosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
       
    ) {
        
    }

    empleado: any = {
        // id: '',
    codigo_rotulacion_empleado: '',
    nombre_empleado: '',
    tipo_contrato_empleado: '',
    fecha_inicio_empleado: null,
    fecha_vencimiento_contrato_empleado: null,
    tipo_documento_empleado: '',
    identificacion_empleado: '',
    fecha_nacimiento_empleado: null,
    edad_empleado: 0,
    lugar_nacimiento_empleado: '',
    direccion_empleado: '',
    municipio_domicilio_empleado: '',
    estado_civil_empleado: '',
    celular_empleado: '',
    correo_empleado: '',
    alergia_empleado: '',
    grupo_sanguineo_empleado: '',
    contacto_emergencia: [
      {
        nombre_contacto_emergencia: '',
        parentesco_empleado: '',
        telefono_contacto_emergencia: '',
      },
    ],
    eps_empleado: '',
    pension_empleado: '',
    cuenta_bancaria_empleado: '',
    //area_empleado: '',
    };

    ngOnInit() {
       
    }

    
    

    crearEmpleado() {
       
       

        this.newempleadosService.createEmpleado(this.empleado).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Empleado creado con Éxito',
                    life: 3000
                  });   
                  this.router.navigate(['/list-empleados']);                 
            },
            (error) => {
                if (error.error && error.error.error) {
                    const errorMessage = error.error.error;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error al crear el Empleado',
                      detail: errorMessage,
                      life: 5000
                    });
                  } else {
                    console.error('Error desconocido al crear el Empleado:', error);
                  }
            }
        );
    }


    
   
}

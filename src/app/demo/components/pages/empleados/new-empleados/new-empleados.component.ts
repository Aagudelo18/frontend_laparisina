import { Component, OnInit } from '@angular/core';
import { NewEmpleadosService } from './new-empleados.service';
import { UsuarioService } from '../../usuarios/usuarios.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-new-empleados',
    templateUrl: './new-empleados.component.html',
    styleUrls: ['./new-empleados.component.scss'],
    providers: [MessageService],
})
export class NewEmpleadosComponent implements OnInit {
  mostrarConfirmacionUsuario: boolean = false;
  formEmpleados: any;
  
    constructor(
      private usuarioService :UsuarioService,
        private newempleadosService: NewEmpleadosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private fb: FormBuilder,
       
    ) {
      this.formEmpleados = this.fb.group({
        codigo_rotulacion_empleado: ['', Validators.required],
      nombre_empleado: ['', Validators.required],
      tipo_contrato_empleado: ['', Validators.required],
      fecha_inicio_empleado: [null, Validators.required],
      fecha_vencimiento_contrato_empleado: [null, Validators.required],
      tipo_documento_empleado: ['', Validators.required],
      identificacion_empleado: ['', Validators.required],
      fecha_nacimiento_empleado: [null, Validators.required],
      edad_empleado: [null, Validators.required],
      lugar_nacimiento_empleado: ['', Validators.required],
      direccion_empleado: ['', Validators.required],
      municipio_domicilio_empleado: ['', Validators.required],
      estado_civil_empleado: ['', Validators.required],
      celular_empleado: ['', Validators.required],
      correo_empleado: ['', [Validators.required, Validators.email]],
      alergia_empleado: ['', Validators.required],
      // grupo_sanguineo_empleado: ['', Validators.required],
      contacto_emergencia: this.fb.array([]), // Puedes inicializarlo como un arreglo vacío o agregar lógica específica aquí
      eps_empleado: ['', Validators.required],
      pension_empleado: ['', Validators.required],
      cuenta_bancaria_empleado: ['', Validators.required],
      area_empleado: ['', Validators.required],
      // estado_empleado: ['', Validators.required],
      detalle_empleado:this.fb.array([]),
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),]],
      confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
      }); 
     }
     validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
      const contrasena = control.root.get('contrasena_usuario');
      const confirmarContrasena = control.value;

      if (contrasena && contrasena.value !== confirmarContrasena) {
        return { contrasenaNoCoincide: true };
      }

      return null;
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
    
          // Agregar lógica para crear el usuario asociado al empleado
          const nuevoUsuario = {
            correo_electronico: this.empleado.correo_empleado,
            contrasena_usuario: 'contrasena_predeterminada', // Puedes definir una contraseña predeterminada o lógica para generarla
            confirmar_contrasena: 'contrasena_predeterminada',
          };
    
          this.usuarioService.createUsuario(nuevoUsuario).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Usuario creado con Éxito',
                life: 3000
              });
            },
            (error) => {
              console.error('Error al crear el usuario:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el usuario',
                detail: 'Error al crear el usuario',
                life: 3000
              });
            }
          );
    
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

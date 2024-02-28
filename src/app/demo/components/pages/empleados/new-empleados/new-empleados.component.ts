import { Component, OnInit } from '@angular/core';
import { NewEmpleadosService } from './new-empleados.service';
// import { UsuarioService } from '../../usuarios/usuarios.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Empleado } from '../list-empleados/empleados.model';
import { Observable, Subject, throwError } from 'rxjs';
import { UsuarioService } from '../new-empleados/usuarios.service'


@Component({
    selector: 'app-new-empleados',
    templateUrl: './new-empleados.component.html',
    styleUrls: ['./new-empleados.component.scss'],
    providers: [MessageService],
})
export class NewEmpleadosComponent implements OnInit {
  nuevoUsuario: any = {};
  formEmpleados: any;
  fechaInicioInvalida: boolean = false;
  fechaVencimientoInvalida: boolean = false;
  touchedCelular = false;
  formEmpleado: FormGroup; 
  ListEmpleados: Empleado[] = [];
  mostrarConfirmacionUsuario = false;
  confirmacionUsuarioSubject = new Subject<boolean>();
  
  
  empleado: any = {
    
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
correo_electronico: '',
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
      
  
  
    constructor(
      private usuarioService :UsuarioService,
        private newempleadosService: NewEmpleadosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        
       
    ) {
      this.formEmpleados = this.formBuilder.group({
        codigo_rotulacion_empleado: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
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
      correo_electronico: ['', [Validators.required, Validators.email]],
      alergia_empleado: ['', Validators.required],
      grupo_sanguineo_empleado: ['', Validators.required],
      contacto_emergencia: this.formBuilder.array([]), // Puedes inicializarlo como un arreglo vacío o agregar lógica específica aquí
      eps_empleado:['', Validators.required],
      pension_empleado: ['', Validators.required],
      cuenta_bancaria_empleado: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/),
        ],
      ],
  
      area_empleado: ['', Validators.required],
      // estado_empleado: ['', Validators.required],
      // detalle_empleado:this.formBuilder.array([]),
      
      contrasena_usuario: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
      ]],
      confirmar_contrasena: ['']
    }, { validators: this.contrasenaCoincideValidator });




      
     }
     
     validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
      console.log('Validando contrasenaConfirmada...');
      const contrasena = control.root.get('contrasena_usuario')?.value;
      const confirmarContrasena = control.value;
    
      if (contrasena !== confirmarContrasena) {
        console.log('Contraseñas no coinciden.');
        return { contrasenaNoCoincide: true };
      }
    
      console.log('Contraseñas coinciden.');
      return null;
    }
    contrasenaCoincideValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
      const contrasena = control.get('contrasena_usuario')?.value;
      const confirmarContrasena = control.get('confirmar_contrasena')?.value;
    
      return contrasena === confirmarContrasena ? null : { contrasenaNoCoincide: true };
    };
    public isValidNombreContacto(nombreContacto: string): boolean {
      const regex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ ]+$/;
      return regex.test(nombreContacto);
    }
    touchedFields: { [key: string]: boolean } = {};

    markAsTouched(fieldName: string): void {
      this.touchedFields[fieldName] = true;
    }
    
    
    
    
    
    
    
    
    
    

    validarFechaInicio() {
      const fechaInicio = new Date(this.empleado.fecha_inicio_empleado);
      const fechaHoy = new Date();
  
      this.fechaInicioInvalida = fechaInicio > fechaHoy;
    }
  
    validarFechas() {
      const fechaInicio = new Date(this.empleado.fecha_inicio_empleado);
      const fechaVencimiento = new Date(this.empleado.fecha_vencimiento_contrato_empleado);
      const fechaHoy = new Date();
  
      this.fechaInicioInvalida = fechaInicio > fechaHoy;
      this.fechaVencimientoInvalida = !this.empleado.fecha_vencimiento_contrato_empleado || fechaVencimiento < fechaInicio;
    }
    isValidCelular(): boolean {
      return /^[0-9]{10}$/.test(this.empleado.celular_empleado);
    }
    isValidCorreo(): boolean {
      // Expresión regular para verificar el formato del correo
      const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return correoRegex.test(this.empleado.correo_electronico);
    }
  

    ngOnInit() {
       
    }
    
    
    

    crearEmpleado() {
      
        // Establecer directamente el rol de empleado
        this.empleado.rol_usuario = '654aefc54524da3db0bc3a18'; 
      
        const nuevoUsuario = {
          rol_usuario: '654aefc54524da3db0bc3a18',
          correoElectronico: this.empleado.correo_electronico,
          contrasena_usuario: this.formEmpleados.value.contrasena_usuario,
          confirmar_contrasena: this.formEmpleados.value.confirmar_contrasena,
        };
 // Verifica la igualdad de contraseñas antes de enviar la solicitud para crear el usuario
if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
this.confirmarCrearUsuario().subscribe(
 (usuarioConfirmado) => {
   if (usuarioConfirmado) {
     // El usuario fue confirmado, ahora puedes crear el cliente
    this.newempleadosService.createEmpleado({ ...this.empleado, estado: 'Activo' }).subscribe(
       () => {
         this.messageService.add({
           severity: 'success',
           summary: 'El empleado fue creado con éxito',
           detail: 'Empleado creado',
           life: 6000,
         });
        
       },
       (error) => {
         console.error('Error al crear el empleado:', error);
         this.messageService.add({
           severity: 'error',
           summary: 'Error al crear el empleado',
           detail: 'Error al crear el empleado',
           life: 3000,
         });
       }
     );
   } else {
     // El usuario no fue confirmado, puedes manejarlo según tus necesidades
     console.log('Error por no fonfirmar el usuario')
   }
 },
 (error) => {
  console.error('Error al confirmar el usuario:', error);
  console.error('Detalles del error:', error.errors);
   // Manejar errores al confirmar el usuario
 }
);
} else {
this.messageService.add({
 severity: 'error',
 summary: 'Error',
 detail: 'Error al crear el cliente',
 life: 3000,
});
}
};



confirmarCrearUsuario() {
const nuevoUsuario = {
correo_electronico:this.empleado.correo_electronico,
contrasena_usuario: this.formEmpleados.value.contrasena_usuario,
confirmar_contrasena: this.formEmpleados.value.confirmar_contrasena,
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
}
    cancelarCreacion() {
      this.router.navigate(['/list-empleados']);
    }
  }
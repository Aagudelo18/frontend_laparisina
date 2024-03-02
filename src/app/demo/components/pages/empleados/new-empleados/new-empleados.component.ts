import { Component, OnInit } from '@angular/core';
import { NewEmpleadosService } from './new-empleados.service';
// import { UsuarioService } from '../../usuarios/usuarios.service';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Empleado } from '../list-empleados/empleados.model';
import { Observable, Subject, throwError } from 'rxjs';
import { UsuarioService } from '../new-empleados/usuarios.service'
import { CategoriaService } from '../../categoria/categoria.service';
import { differenceInYears, isBefore, addYears } from 'date-fns';
import { ChangeDetectorRef } from '@angular/core';



@Component({
    selector: 'app-new-empleados',
    templateUrl: './new-empleados.component.html',
    styleUrls: ['./new-empleados.component.scss'],
    providers: [MessageService, CategoriaService],
})
export class NewEmpleadosComponent implements OnInit {
  nuevoUsuario: any = {};
  formEmpleados: any;
  fechaInicioInvalida: boolean = false;
  fechaVencimientoInvalida: boolean = false;
  touchedCelular = false;
  formEmpleado: FormGroup; 
  ListEmpleados: Empleado[] = [];
  areas: string[] = [];
  mostrarConfirmacionUsuario = false;
  confirmacionUsuarioSubject = new Subject<boolean>();
  identificacionEmpleado: string = '';
  empleadoExistente: boolean = false;
  
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
        private categoriaService: CategoriaService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
        
        
       
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
      tipo_cuenta:['', Validators.required],
      banco_cuenta:['', Validators.required],
  
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
      this.getListAreas();
       
    }
    getEmpleado(numero_identificacion_empleado: string) {
      // Verificar si el documento está vacío
      if (!numero_identificacion_empleado) {
        // Limpiar los valores de los campos relacionados con el empleado
        this.formEmpleados.reset();
        // Puedes agregar otros campos que necesites reiniciar aquí
    
        // Actualiza el valor de la variable 'empleadoExistente'
        this.empleadoExistente = false;
      } else {
        this.newempleadosService.obtenerEmpleadoPorIdentificacion(numero_identificacion_empleado).subscribe(
          (data: any) => {
            
            // Verificar si el empleado existe
            if (data) {
              this.empleadoExistente = true;
              // Actualizar las propiedades del formulario 'formEmpleados' con la información del empleado
              this.formEmpleados.patchValue({
                codigo_rotulacion_empleado: data.codigo_rotulacion_empleado,
         nombre_empleado: data.nombre_empleado,
         tipo_contrato_empleado:data.tipo_contrato_empleado ,
         fecha_inicio_empleado: data.fecha_inicio_empleado,
         fecha_vencimiento_contrato_empleado: data.fecha_vencimiento_contrato_empleado,
         tipo_documento_empleado: data.tipo_documento_empleado,
         identificacion_empleado: data.identificacion_empleado,
         fecha_nacimiento_empleado: data.fecha_nacimiento_empleado,
        edad_empleado: data.edad_empleado,
         lugar_nacimiento_empleado: data.lugar_nacimiento_empleado,
         direccion_empleado:data.direccion_empleado,
         municipio_domicilio_empleado:data.municipio_domicilio_empleado ,
         estado_civil_empleado: data.estado_civil_empleado,
         celular_empleado: data.celular_empleado,
         correo_electronico: data.correo_electronico,
         alergia_empleado: data.alergia_empleado,
         grupo_sanguineo_empleado: data.grupo_sanguineo_empleado,
         eps_empleado: data.eps_empleado,
         pension_empleado: data.pension_empleado,
         cuenta_bancaria_empleado:data.cuenta_bancaria_empleado,
         tipo_cuenta: data.tipo_cuenta,
         banco_cuenta: data.banco_cuenta,
         area_empleado: data.area_empleado,
         contrasena_usuario: this.formEmpleados.value.contrasena_usuario,
         confirmar_contrasena: this.formEmpleados.value.confirmar_contrasena,
      });
      const contactoEmergenciaArray = this.formEmpleados.get('contacto_emergencia') as FormArray;
      contactoEmergenciaArray.clear();  // Limpia los controles actuales
      data.contacto_emergencia.forEach((contacto: any) => {
        contactoEmergenciaArray.push(this.fb.group({
          nombre_contacto_emergencia: [contacto.nombre_contacto_emergencia || ''],
          parentesco_empleado: [contacto.parentesco_empleado || ''],
          telefono_contacto_emergencia: [contacto.telefono_contacto_emergencia || '']
        }));
      });
      this.cdr.detectChanges();
    
              console.log(data);
            } else {
              // El empleado no existe, puedes manejarlo según tus necesidades
              this.empleadoExistente = false;
              this.messageService.add({
                severity: 'error',
                summary: 'El empleado no está registrado',
                life: 3000,
              });
            }
          },
          (error) => {
            console.error(error);
    
            // Manejar el error de la solicitud HTTP
            if (error.status === 404) {
              // El empleado no se encontró en el servidor
              this.empleadoExistente = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Empleado no encontrado',
                detail: 'El empleado no está registrado',
                life: 3000,
              });
            } else {
              // Otro manejo de errores según tus necesidades
              this.messageService.add({
                severity: 'error',
                summary: 'Error en la solicitud',
                detail: 'Ocurrió un error al obtener los detalles del empleado',
                life: 3000,
              });
            }
          }
        );
      }
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
 detail: 'Error al crear el empleado',
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
esMayorDeEdad(): boolean {
  const fechaNacimiento = new Date(this.empleado.fecha_nacimiento_empleado);
  const hoy = new Date();

  // Calcular la edad utilizando date-fns
  const edad = differenceInYears(hoy, fechaNacimiento);

  // Calcular la fecha hace 18 años
  const fechaHace18Anos = addYears(hoy, -18);

  // Verificar que la fecha de nacimiento haya ocurrido y que la persona tenga al menos 18 años
  return isBefore(fechaNacimiento, fechaHace18Anos);
}




confirmarCreacionUsuario() {
this.mostrarConfirmacionUsuario = false;
this.confirmacionUsuarioSubject.next(true); // Confirmar la creación del usuario
}
    cancelarCreacion() {
      this.router.navigate(['/list-empleados']);
    }
    getListAreas(){     
      this.categoriaService.getListCategorias().subscribe((data) =>{      
        this.areas = data.
        filter(categoria => categoria.estado_categoria_producto === true)
        .map(categoria => categoria.nombre_categoria_producto);
      })   
           
    }
    onCategoriaChange(event) {
      console.log('Categoría seleccionada:', event.value);
      // Realizar otras acciones según sea necesario
    }
  }
  
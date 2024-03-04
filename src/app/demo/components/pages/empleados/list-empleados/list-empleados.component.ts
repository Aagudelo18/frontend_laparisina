import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from './empleados.service';
import { UsuarioService } from '../../usuarios/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from './empleados.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {   FormArray } from '@angular/forms';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.scss'],
  providers: [MessageService, ConfirmationService],
})



export class ListEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  selectedEmpleados: Empleado[] = [];
  detalleEmpleadoDialog: boolean = false;
  selectedEmpleadoId: string;
  empleado: any = {};
  id: string = '';
  formEmpleados: FormGroup;
  roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  estadoSiguiente: string;
  formEditarEmpleado: FormGroup;
  //vistas de listar pedidos array
 
  pestanaSeleccionada: number = 0; // 0 para pedidos pendientes, 1 para pedidos terminados
  editarEmpleadoDialog: boolean = false;
  fileCrear: any;
  fileEditar: any;
  file: null;
  editarEmpleadoaDialog: boolean = false;
  private confirmacionUsuarioSubject = new Subject<boolean>();
  mostrarConfirmacionUsuario = false; 
  fechaInicioInvalida: boolean = false;
  fechaVencimientoInvalida: boolean = false;
  touchedCelular = false;
  empleadoExistente: boolean = false;



  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private usuarioService :UsuarioService,
    ) 
    // {this.formEmpleados = this.fb.group({
    //   contacto_emergencia: this.fb.array([]),
      
    // });
      {}
      

     //Verifica o se asegura de que el campo de confirmar contraseña coincida con la contraseña.
     validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
      const contrasena = control.root.get('contrasena_usuario');
      const confirmarContrasena = control.value;

      if (contrasena && contrasena.value !== confirmarContrasena) {
        return { contrasenaNoCoincide: true };
      }

      return null;
    }
    ngOnInit() {
      
      this.formEmpleados = this.fb.group({
        codigo_rotulacion_empleado: ['', Validators.required],
        nombre_empleado: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]*$/)
          ]
        ],
      tipo_contrato_empleado: ['', Validators.required],
      fecha_inicio_empleado: [null, Validators.required,],
      fecha_vencimiento_contrato_empleado: [
        null,
        [
          Validators.required,
          Validators.pattern(/^\d{4}-\d{2}-\d{2}$/), // Asegura que cumpla con el formato YYYY-MM-DD
          Validators.pattern(/^\d+$/) // Asegura que solo contenga números
        ]
      ],
      
      tipo_documento_empleado: ['', Validators.required],
      identificacion_empleado: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      fecha_nacimiento_empleado: [null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      edad_empleado: [null, Validators.required],
      lugar_nacimiento_empleado: ['', Validators.required],
      direccion_empleado: ['', Validators.required],
      municipio_domicilio_empleado: ['', Validators.required],
      estado_civil_empleado: ['', Validators.required],
      celular_empleado: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      alergia_empleado: ['', Validators.required],
      grupo_sanguineo_empleado: ['', Validators.required],
      contacto_emergencia: this.fb.array([]), // Puedes inicializarlo como un arreglo vacío o agregar lógica específica aquí
      eps_empleado: ['', Validators.required],
      pension_empleado: ['', Validators.required],
      cuenta_bancaria_empleado: [null, [Validators.required, Validators.pattern('[0-9]{10}')]],
      tipo_cuenta: ['', Validators.required],
     banco_cuenta: ['', Validators.required],
      area_empleado: ['', Validators.required],
      // estado_empleado: ['', Validators.required],
      detalle_empleado:this.fb.array([]),
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),]],
      confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
      }); 
     
      this.empleadosService.getEmpleado().subscribe((data: Empleado[]) => {
        this.empleados = data;
      });
      this.empleadosService.getEmpleado().subscribe((data: Empleado[]) => {
        this.empleados = data;
      });
    }
      // this.cargarEmpleados();
      // this.cargarEmpleadosPendientes();
      // this.cargarEmpleadosTerminados();

    
    //Cambiar de pestañas en el listar ----------------------------------------------------------------
    cambiarPestana(event) {
      this.pestanaSeleccionada = event.index;
      
    }

    //Cargar los pedidos-----------------------------------------------------------------------------
    // cargarEmpleados() {
    //   if (this.pestanaSeleccionada === 0) {
    //     this.empleadosService.getEmpleadosPendientes().subscribe((data: Empleado[]) => {
    //       this.empleadosPendientes = data;
    //     });
    //   } else if (this.pestanaSeleccionada === 1) {
    //     this.empleadosService.getEmpleadosTerminados().subscribe((data: Empleado[]) => {
    //       this.empleadosTerminados = data;
    //     });
    //   }
    // }
  
    // cargarEmpleadosPendientes() {
    //   this.empleadosService.getEmpleadosPendientes().subscribe((data: Empleado[]) => {
    //     this.empleadosPendientes = data;
    //   });
    // }
  
    // cargarEmpleadosTerminados() {
    //   this.empleadosService.getEmpleadosTerminados().subscribe((data: Empleado[]) => {
    //     this.empleadosTerminados = data;
    //   });
    // }
  openNewEmpleados() {
    this.router.navigate(['/new-empleados']);
  }

  enviarListEmpleado(){
    this.router.navigate(['/list-empleados']);
  }

  verDetalleEmpleado(id: string) {
    this.id = id;
    this.detalleEmpleadoDialog = true;
    this.getEmpleadoDetalle(id);
  }
   getEmpleados(id:string){      
     this.empleadosService.getEmpleados(id).subscribe((data:Empleado) => {
      console.log('Datos del empleado:', data);
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
   },
   (error) => {
    console.error('Error al obtener datos del empleado:', error);
  }
  );
}

  getEmpleadoDetalle(id: string){
    if (this.formEmpleados) {
    this.empleadosService.getEmpleadoDetalle(id).subscribe((data)=>{
      const contactoEmergencia = data.contacto_emergencia || {};
      let detalleEmpleado = data.detalle_empleado || [];
    detalleEmpleado = Array.isArray(detalleEmpleado) ? detalleEmpleado : [detalleEmpleado]; // Conviértelo en un array si no lo es
      
    setTimeout(() => {
      const detallesFormateados = detalleEmpleado.map(detalle => {
        return {
          tipo_contrato_empleado: detalle.tipo_contrato_empleado || '',
          fecha_inicio_empleado: detalle.fecha_inicio_empleado || null,
          fecha_vencimiento_contrato_empleado: detalle.fecha_vencimiento_contrato_empleado,
          fecha_nacimiento_empleado: detalle.fecha_nacimiento_empleado,
          edad_empleado: detalle.edad_empleado,
          lugar_nacimiento_empleado: detalle.lugar_nacimiento_empleado,
          direccion_empleado: detalle.direccion_empleado,
          municipio_domicilio_empleado: detalle.municipio_domicilio_empleado,
          estado_civil_empleado: detalle.estado_civil_empleado,
          celular_empleado: detalle.celular_empleado,
          correo_electronico: detalle.correo_electronico,
          alergia_empleado: detalle.alergia_empleado,
          grupo_sanguineo_empleado: detalle.grupo_sanguineo_empleado,
          eps_empleado: detalle.eps_empleado,
          pension_empleado: detalle.pension_empleado,
          cuenta_bancaria_empleado: detalle.cuenta_bancaria_empleado,
          area_empleado: detalle.area_empleado ,
          // ... Otros campos del detalle que necesites
        };
      });
      
      this.formEmpleados.get('codigo_rotulacion_empleado').setValue(data.codigo_rotulacion_empleado);
      this.formEmpleados.get('nombre_empleado').setValue(data.nombre_empleado);
      this.formEmpleados.get('tipo_contrato_empleado').setValue(data.tipo_contrato_empleado);
      this.formEmpleados.get('fecha_inicio_empleado').setValue(data.fecha_inicio_empleado);
      this.formEmpleados.get('fecha_vencimiento_contrato_empleado').setValue(data.fecha_vencimiento_contrato_empleado);
      this.formEmpleados.get('tipo_documento_empleado').setValue(data.tipo_documento_empleado);
      this.formEmpleados.get('identificacion_empleado').setValue(data.identificacion_empleado);
      this.formEmpleados.get('fecha_nacimiento_empleado').setValue(data.fecha_nacimiento_empleado);
      this.formEmpleados.get('edad_empleado').setValue(data.edad_empleado);
      this.formEmpleados.get('lugar_nacimiento_empleado').setValue(data.lugar_nacimiento_empleado);
      this.formEmpleados.get('direccion_empleado').setValue(data.direccion_empleado);
      this.formEmpleados.get('municipio_domicilio_empleado').setValue(data.municipio_domicilio_empleado);
      this.formEmpleados.get('estado_civil_empleado').setValue(data.estado_civil_empleado);
      this.formEmpleados.get('celular_empleado').setValue(data.celular_empleado);
      this.formEmpleados.get('correo_electronico').setValue(data.correo_electronico);
      this.formEmpleados.get('alergia_empleado').setValue(data.alergia_empleado);
      this.formEmpleados.get('grupo_sanguineo_empleado').setValue(data.grupo_sanguineo_empleado);
      this.formEmpleados.get('eps_empleado').setValue(data.eps_empleado);
      const contactoEmergenciaArray = this.formEmpleados.get('contacto_emergencia') as FormArray;
    contactoEmergenciaArray.clear();  // Limpia los controles actuales
    contactoEmergencia.forEach((contacto: any) => {
      contactoEmergenciaArray.push(this.fb.group({
        nombre_contacto_emergencia: [contacto.nombre_contacto_emergencia || ''],
        parentesco_empleado: [contacto.parentesco_empleado || ''],
        telefono_contacto_emergencia: [contacto.telefono_contacto_emergencia || '']
      }));
    });

      this.formEmpleados.get('pension_empleado').setValue(data.pension_empleado);
      this.formEmpleados.get('cuenta_bancaria_empleado').setValue(data.cuenta_bancaria_empleado);
      this.formEmpleados.get('tipo_cuenta').setValue(data.tipo_cuenta);
      this.formEmpleados.get('banco_cuenta').setValue(data.banco_cuenta);
      this.formEmpleados.get('area_empleado').setValue(data.area_empleado);
      // this.formEmpleados.get('detalle_empleado').patchValue(detallesFormateados);
        
    });
  });
}}
   

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  getListEmpleados(){     
    this.empleadosService.getEmpleado().subscribe((data) =>{      
      this.empleados = data;        
    })        
}

actualizarEmpleado() {
  const empleadoActualizado: Empleado = {
    _id: this.formEmpleados.value._id,
    codigo_rotulacion_empleado: this.formEmpleados.value.codigo_rotulacion_empleado,
    nombre_empleado: this.formEmpleados.value.nombre_empleado,
    tipo_contrato_empleado: this.formEmpleados.value.tipo_contrato_empleado,
    fecha_inicio_empleado: this.formEmpleados.value.fecha_inicio_empleado,
    fecha_vencimiento_contrato_empleado: this.formEmpleados.value.fecha_vencimiento_contrato_empleado,
    tipo_documento_empleado: this.formEmpleados.value.tipo_documento_empleado,
    identificacion_empleado: this.formEmpleados.value.identificacion_empleado,
    fecha_nacimiento_empleado: this.formEmpleados.value.fecha_nacimiento_empleado,
    edad_empleado: this.formEmpleados.value.edad_empleado,
    lugar_nacimiento_empleado: this.formEmpleados.value.lugar_nacimiento_empleado,
    direccion_empleado: this.formEmpleados.value.direccion_empleado,
    municipio_domicilio_empleado: this.formEmpleados.value.municipio_domicilio_empleado,
    estado_civil_empleado: this.formEmpleados.value.estado_civil_empleado,
    celular_empleado: this.formEmpleados.value.celular_empleado,
    correo_electronico: this.formEmpleados.value.correo_electronico,
    alergia_empleado: this.formEmpleados.value.alergia_empleado,
    contacto_emergencia: this.formEmpleados.value.contacto_emergencia as { nombre_contacto_emergencia: string; parentesco_empleado: string; telefono_contacto_emergencia: string }[],
    grupo_sanguineo_empleado:this.formEmpleados.value.grupo_sanguineo_empleado,
    eps_empleado: this.formEmpleados.value.eps_empleado,
    pension_empleado: this.formEmpleados.value.pension_empleado,
    cuenta_bancaria_empleado: this.formEmpleados.value.cuenta_bancaria_empleado,
    tipo_cuenta: this.formEmpleados.value.tipo_cuenta,
    banco_cuenta: this.formEmpleados.value.banco_cuenta,
    area_empleado: this.formEmpleados.value.area_empleado,
    area_empleado_produccion: this.formEmpleados.value.area_empleado_produccion,

    
  
  };
  if (this.id !== '') {
    empleadoActualizado._id = this.id;
    this.empleadosService.autualizarEmpleado(this.id, empleadoActualizado).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'El Empleado fue actualizado con éxito',
        detail: 'Empleado actualizado',
        life: 6000
      });
      
      this.getListEmpleados();
      this.editarEmpleadoDialog = false;
    });
  }
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


openEditarEmpleadoDialog(id:string) {
  this.id = id;
  this.editarEmpleadoDialog = true;
  this.getEmpleados(id);
}
formatearFecha(fecha: string | Date): string {
  if (fecha) {
    const fechaFormateada = new Date(fecha);
    
    // Verificar si la fecha es válida
    if (!isNaN(fechaFormateada.getTime())) {
      return fechaFormateada.toLocaleDateString('es-CO');
    } else {
      console.error('Fecha inválida:', fecha);
    }
  }
  return '';
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
    this.empleadosService.obtenerEmpleadoPorIdentificacion(numero_identificacion_empleado).subscribe(
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

actualizarFechaInicio(event: any) {
  this.formEmpleados.patchValue({
    fecha_inicio_empleado: event.target.value,
  });
}




}
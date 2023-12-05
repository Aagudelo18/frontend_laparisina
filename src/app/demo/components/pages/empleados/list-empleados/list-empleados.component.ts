import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from './empleados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from './empleados.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {   FormArray } from '@angular/forms';



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
  empleadosPendientes: Empleado[] = [];
  empleadosTerminados: Empleado[] = [];
  pestanaSeleccionada: number = 0; // 0 para pedidos pendientes, 1 para pedidos terminados
  editarEmpleadoDialog: boolean = false;
  fileCrear: any;
  fileEditar: any;
  file: null;
  editarEmpleadoaDialog: boolean = false;

  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    ) 
    // {this.formEmpleados = this.fb.group({
    //   contacto_emergencia: this.fb.array([]),
      
    // });
      {
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
      
      }); 
     }

    ngOnInit() {
      
      this.empleadosService.getEmpleado().subscribe((data: Empleado[]) => {
        this.empleados = data;
      });

      this.cargarEmpleados();
      this.cargarEmpleadosPendientes();
      this.cargarEmpleadosTerminados();

    }
    //Cambiar de pestañas en el listar ----------------------------------------------------------------
    cambiarPestana(event) {
      this.pestanaSeleccionada = event.index;
      this.cargarEmpleados();
    }

    //Cargar los pedidos-----------------------------------------------------------------------------
    cargarEmpleados() {
      if (this.pestanaSeleccionada === 0) {
        this.empleadosService.getEmpleadosPendientes().subscribe((data: Empleado[]) => {
          this.empleadosPendientes = data;
        });
      } else if (this.pestanaSeleccionada === 1) {
        this.empleadosService.getEmpleadosTerminados().subscribe((data: Empleado[]) => {
          this.empleadosTerminados = data;
        });
      }
    }
  
    cargarEmpleadosPendientes() {
      this.empleadosService.getEmpleadosPendientes().subscribe((data: Empleado[]) => {
        this.empleadosPendientes = data;
      });
    }
  
    cargarEmpleadosTerminados() {
      this.empleadosService.getEmpleadosTerminados().subscribe((data: Empleado[]) => {
        this.empleadosTerminados = data;
      });
    }
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
         correo_empleado: data.correo_empleado,
         alergia_empleado: data.alergia_empleado,
         
         eps_empleado: data.eps_empleado,
         pension_empleado: data.pension_empleado,
         cuenta_bancaria_empleado:data.cuenta_bancaria_empleado,
         area_empleado: data.area_empleado,
        
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
          correo_empleado: detalle.correo_empleado,
          alergia_empleado: detalle.alergia_empleado,
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
      this.formEmpleados.get('correo_empleado').setValue(data.correo_empleado);
      this.formEmpleados.get('alergia_empleado').setValue(data.alergia_empleado);
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
      this.formEmpleados.get('area_empleado').setValue(data.area_empleado);
      // this.formEmpleados.get('detalle_empleado').patchValue(detallesFormateados);
        
    });
  });
}
  //   esPersonaNatural() {
  //     return this.formEmpleados.get('tipo_cliente').value === 'Persona natura';
  //  }
   
  //  esEmpresa() {
  //     return this.formEmpleados.get('tipo_cliente').value === 'Empresa';
  //  }
   

    
  //  cambiarEstadoPedido(empleado: Empleado, nuevoEstado: string) {
  //   // Validación: Solo permitir cambiar de 'Pendiente' a 'Tomado'
  //   if (empleado.estado_empleado === 'Pendiente' && nuevoEstado === 'Tomado') {
  //     // Actualizar el estado del pedido
  //     this.empleadosService.updateEmpleado(empleado._id, empleado).subscribe(
  //       () => {
  //         console.log(`Estado del pedido con ID ${empleado._id} actualizado a 'Tomado'.`);
  //         // Actualizar la lista de pedidos después de la actualización
  //         this.cargarEmpleados();
  //       },
  //       (error) => {
  //         console.error('Error al actualizar el estado del pedido:', error);
  //         // Manejar el error según tus necesidades
  //       }
  //     );
  //   } else {
  //     console.warn(`No se puede cambiar el estado del pedido con ID ${empleado._id}.`);
  //     // Puedes mostrar un mensaje al usuario indicando que no se puede cambiar el estado
  //   }

   
  


  // cambiarEmpleado(id: string) {
  //   const empleado = this.empleados.find((empleado) => empleado._id === id);
  
  //   // Si el pedido está en el estado "Pendiente", establece el estado siguiente
  //   if (empleado.estado_empleado === 'Pendiente') {
  //     empleado.estado_empleado = 'Tomado';
  //   }
  //   else {
  //     empleado.estado_empleado = empleado.estado_empleado;
  //   }
  
    // Pasa el pedido al método updatePedido()
  //   this.empleadosService.updateEmpleado(empleado._id, empleado).subscribe(
  //     (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Cambio de estado con Éxito',
  //         life: 5000
  //       }); 
  //       // Actualizar la lista de pedidos
  //       this.cargarEmpleados();
  //     },
  //     (error) => {
  //       if (error.error && error.error.error) {
  //         const errorMessage = error.error.error;
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error al cambiar el estado del Pedido',
  //           detail: errorMessage,
  //           life: 5000
  //         });
  //       } else {
  //         console.error('Error desconocido al crear el Pedido:', error);
  //       }
  //     }
  //   );
  // }


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
    correo_empleado: this.formEmpleados.value.correo_empleado,
    alergia_empleado: this.formEmpleados.value.alergia_empleado,
    contacto_emergencia: this.formEmpleados.value.contacto_emergencia as { nombre_contacto_emergencia: string; parentesco_empleado: string; telefono_contacto_emergencia: string }[],
  
    eps_empleado: this.formEmpleados.value.eps_empleado,
    pension_empleado: this.formEmpleados.value.pension_empleado,
    cuenta_bancaria_empleado: this.formEmpleados.value.cuenta_bancaria_empleado,
    area_empleado: this.formEmpleados.value.area_empleado,
    detalle_empleado: this.formEmpleados.value.detalle_empleado,
  
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

openEditarEmpleadoDialog(id:string) {
  this.id = id;
  this.editarEmpleadoDialog = true;
  this.getEmpleados(id);
}


}
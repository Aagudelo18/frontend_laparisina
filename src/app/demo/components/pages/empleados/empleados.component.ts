import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { Empleado } from './empleado.model';
import { EmpleadosService } from './EmpleadosService';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './empleados.component.html',
    providers: [MessageService]
    
})


export class EmpleadosComponent implements OnInit {
    empleados: Empleado[] = [];
    editarEmpleadoPDialog: boolean = false;
    empleadoEditado: Empleado = {} as Empleado; 
    formEmpleado:FormGroup;
    id: string = '';

    constructor(private fb:FormBuilder,
      private empleadosService: EmpleadosService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute) {
        this.aRouter.params.subscribe(params => {
          this.id = params['_id'];
          console.log('Valor de _id:', this.id);
        });
         // Obtén el valor del parámetro 'id' de la URL y actualiza id
         
      }

      
    displayCreateDialog: boolean = false; // Declaración de displayCreateDialog
    displayEditDialog: boolean = false;
    
        
          

        
         
      

    ngOnInit() : void {
      this.empleadosService.getEmpleados().subscribe((data) => {
        this.empleados = data;
        
      });
      this.formEmpleado = this.fb.group({
        _id: [''],});
     
      this.actualizarListaEmpleados();
      
    }
    getEmpleado(id: string) {      
     console.log('Valor de _id en getEmpleado:', id);
  this.empleadosService.getEmpleadoById(id).subscribe((data: Empleado) => {
        // Crea una variable para almacenar los datos del contacto de emergencia
        const contactoEmergencia = data.contacto_emergencia[0] || {};
        
        // Asigna los valores al formulario
        this.formEmpleado.setValue({
          _id: data._id,
          codigo_rotulacion_empleado: data.codigo_rotulacion_empleado,
          nombre_empleado: data.nombre_empleado,
          tipo_contrato_empleado: data.tipo_contrato_empleado,
          fecha_inicio_empleado: data.fecha_inicio_empleado,
          fecha_vencimiento_contrato_empleado: data.fecha_vencimiento_contrato_empleado,
          tipo_documento_empleado: data.tipo_documento_empleado,
          identificacion_empleado: data.identificacion_empleado,
          fecha_nacimiento_empleado: data.fecha_nacimiento_empleado,
          edad_empleado: data.edad_empleado,
          lugar_nacimiento_empleado: data.lugar_nacimiento_empleado,
          direccion_empleado: data.direccion_empleado,
          municipio_domicilio_empleado: data.municipio_domicilio_empleado,
          estado_civil_empleado: data.estado_civil_empleado,
          celular_empleado: data.celular_empleado,
          correo_empleado: data.correo_empleado,
          alergia_empleado: data.alergia_empleado,
          grupo_sanguineo_empleado: data.grupo_sanguineo_empleado,
          contacto_emergencia: {
            nombre_contacto_emergencia: contactoEmergencia['nombre_contacto_emergencia'] || '',
            parentesco_empleado: contactoEmergencia['parentesco_empleado'] || '',
            telefono_contacto_emergencia: contactoEmergencia['telefono_contacto_emergencia'] || ''
          },
          eps_empleado: data.eps_empleado,
          pension_empleado: data.pension_empleado,
          cuenta_bancaria_empleado: data.cuenta_bancaria_empleado,
          area_empleado: data.area_empleado
        });
      });
    }
    
    
    
     // Objeto para almacenar los datos del nuevo empleado
  nuevoEmpleado: any = {
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

  // // Función para abrir el cuadro de diálogo de creación de empleado
  // // crearEmpleado() {
  // //   // Reiniciar el objeto del nuevo empleado
  // //   this.nuevoEmpleado = {
  // //     _id: '',
  // //     codigo_rotulacion_empleado: '',
  // //     nombre_empleado: '',
  // //     tipo_contrato_empleado: '',
  // //     fecha_inicio_empleado: null,
  // //     fecha_vencimiento_contrato_empleado: null,
  // //     tipo_documento_empleado: '',
  // //     identificacion_empleado: '',
  // //     fecha_nacimiento_empleado: null,
  // //     edad_empleado: 0,
  // //     lugar_nacimiento_empleado: '',
  // //     direccion_empleado: '',
  // //     municipio_domicilio_empleado: '',
  // //     estado_civil_empleado: '',
  // //     celular_empleado: '',
  // //     correo_empleado: '',
  // //     alergia_empleado: '',
  // //     grupo_sanguineo_empleado: '',
  // //     contacto_emergencia: [
  // //       {
  // //         nombre_contacto_emergencia: '',
  // //         parentesco_empleado: '',
  // //         telefono_contacto_emergencia: '',
  // //       },
  // //     ],
  // //     eps_empleado: '',
  // //     pension_empleado: '',
  // //     cuenta_bancaria_empleado: '',
  // //     area_empleado: '',
  // //   };


  // // }
  crearEmpleado() {
    this.empleadosService.crearEmpleado(this.nuevoEmpleado).subscribe(
        (empleadoCreado) => {
            console.log('Empleado creado:', empleadoCreado);
            this.actualizarListaEmpleados();
            
              this.displayCreateDialog= false;
                
              
             // Retraso de 1 segundo (ajusta según sea necesario)
        },
        (error) => {
            console.error('Error al crear el empleado:', error);
            // Puedes agregar aquí el código para mostrar un mensaje de error al usuario si lo deseas
        }
    );
}


actualizarListaEmpleados() {
  this.empleadosService.getEmpleados().subscribe(
    (data: Empleado[]) => {
      this.empleados = data;
    },
    (error) => {
      console.error('Error al obtener la lista de empleados:', error);
    }
  );
}

// Función para actualizar una categoría
actualizarEmpleado() {
  const EmpleadoActualizado: Empleado = {
    _id: this.formEmpleado.value._id,
    codigo_rotulacion_empleado: this.formEmpleado.value.codigo_rotulacion_empleado,
    nombre_empleado: this.formEmpleado.value.nombre_empleado,
    tipo_contrato_empleado: this.formEmpleado.value.tipo_contrato_empleado,
    fecha_inicio_empleado: this.formEmpleado.value.fecha_inicio_empleado,
    fecha_vencimiento_contrato_empleado: this.formEmpleado.value.fecha_vencimiento_contrato_empleado,
    tipo_documento_empleado: this.formEmpleado.value.tipo_documento_empleado,
    identificacion_empleado: this.formEmpleado.value.identificacion_empleado,
    fecha_nacimiento_empleado: this.formEmpleado.value.fecha_nacimiento_empleado,
    edad_empleado: this.formEmpleado.value.edad_empleado,
    lugar_nacimiento_empleado: this.formEmpleado.value.lugar_nacimiento_empleado,
    direccion_empleado: this.formEmpleado.value.direccion_empleado,
    municipio_domicilio_empleado: this.formEmpleado.value.municipio_domicilio_empleado,
    estado_civil_empleado: this.formEmpleado.value.estado_civil_empleado,
    celular_empleado: this.formEmpleado.value.celular_empleado,
    correo_empleado: this.formEmpleado.value.correo_empleado,
    alergia_empleado: this.formEmpleado.value.alergia_empleado,
    grupo_sanguineo_empleado: this.formEmpleado.value.grupo_sanguineo_empleado,
    contacto_emergencia: [{
      nombre_contacto_emergencia: this.formEmpleado.value.contacto_emergencia[0].nombre_contacto_emergencia,
      parentesco_empleado: this.formEmpleado.value.contacto_emergencia[0].parentesco_empleado,
      telefono_contacto_emergencia: this.formEmpleado.value.contacto_emergencia[0].telefono_contacto_emergencia,
    }],
    eps_empleado: this.formEmpleado.value.eps_empleado,
    pension_empleado: this.formEmpleado.value.pension_empleado,
    cuenta_bancaria_empleado: this.formEmpleado.value.cuenta_bancaria_empleado,
    area_empleado: this.formEmpleado.value.area_empleado
  };

  // Suscripción al servicio para actualizar el empleado
  // this.empleadosService.actualizarEmpleado(EmpleadoActualizado).subscribe(
  //   (empleadoActualizado) => {
  //     console.log('Empleado actualizado:', empleadoActualizado);
  //     this.actualizarListaEmpleados();
  //     // Puedes agregar aquí el código para cerrar el diálogo de edición o realizar otras acciones necesarias.
  //   },
  //   (error) => {
  //     console.error('Error al actualizar el empleado:', error);
  //     // Puedes agregar aquí el código para mostrar un mensaje de error al usuario si lo deseas
  //   }
  // );



  if (this.id !== '') {
    EmpleadoActualizado._id = this.id;
    this.empleadosService.putEmpleado(this.id, EmpleadoActualizado).subscribe(() => {
      alert('Empleado actualizado con éxito');
      this.messageService.add({
        severity: 'info',
        summary: 'El empleado fue actualizado con éxito',
        detail: 'Empleado actualizado',
        life: 6000
      });
      this.actualizarListaEmpleados();
      this.displayEditDialog = false;
    });
  }else {
    console.error('ID de empleado indefinido al intentar actualizar.');
    // Puedes manejar este caso, por ejemplo, mostrando un mensaje al usuario.
  }
}

openNew() {
  this.id = '';                
  this.formEmpleado.reset()
  this.displayEditDialog = true;
}


// editarEmpleado() {
//   if (this.id) {
//     this.editarEmpleadoPDialog = true;
//     this.id= id;
//     this.getEmpleado(id);
//   } else {
//     console.error('ID de empleado indefinido.');

editarEmpleado(id: string) {
  this.empleadoEditado = { ...this.empleados.find(e => e._id === id) };
  this.displayEditDialog = true;
}


// En tu clase de componente (empleados.component.ts), agrega el siguiente método para manejar el guardado de la edición
guardarEdicion() {
  // Lógica para guardar los cambios en el servicio o donde sea necesario
  // Ejemplo:
  this.empleadosService.actualizarEmpleado(this.empleadoEditado).subscribe(
    (empleadoActualizado) => {
      console.log('Empleado actualizado:', empleadoActualizado);
      this.actualizarListaEmpleados();
      this.displayEditDialog = false; // Cierra el diálogo después de guardar
    },
    (error) => {
      console.error('Error al actualizar el empleado:', error);
      // Puedes agregar aquí el código para mostrar un mensaje de error al usuario si lo deseas
    }
  );
}



 onGlobalFilter(table: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }


}
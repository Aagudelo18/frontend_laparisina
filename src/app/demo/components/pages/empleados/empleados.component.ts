import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { Empleado } from './empleado.model';
import { EmpleadosService } from './empleados.service';

@Component({
    templateUrl: './empleados.component.html',
    providers: [MessageService]
})
export class EmpleadosComponent implements OnInit {
    empleados: Empleado[] = [];

    constructor(private empleadosService: EmpleadosService) {}

    ngOnInit() {
      this.empleadosService.getEmpleados().subscribe((data) => {
        this.empleados = data;
      });
    }

     // Objeto para almacenar los datos del nuevo empleado
  nuevoEmpleado: any = {
    _id: '',
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
    area_empleado: '',
  };

  // Función para abrir el cuadro de diálogo de creación de empleado
  crearEmpleado() {
    // Reiniciar el objeto del nuevo empleado
    this.nuevoEmpleado = {
      _id: '',
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
      area_empleado: '',
    };


  }

}

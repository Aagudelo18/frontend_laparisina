export interface Empleado {
     _id: string;
    codigo_rotulacion_empleado: string;
    nombre_empleado: string;
    tipo_contrato_empleado: string;
    fecha_inicio_empleado: Date;
    fecha_vencimiento_contrato_empleado: Date;
    tipo_documento_empleado: string;
    identificacion_empleado: string;
    fecha_nacimiento_empleado: Date;
    edad_empleado: number;
    lugar_nacimiento_empleado: string;
    direccion_empleado: string;
    municipio_domicilio_empleado: string;
    estado_civil_empleado: string;
    celular_empleado: string;
    correo_empleado: string;
    alergia_empleado: string;
    grupo_sanguineo_empleado: string;
    contacto_emergencia: {
      nombre_contacto_emergencia: string;
      parentesco_empleado: string;
      telefono_contacto_emergencia: string;
    }[];
    eps_empleado: string;
    pension_empleado: string;
    cuenta_bancaria_empleado: string;
    area_empleado: string;
  }

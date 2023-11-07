export interface Rol {
    _id: string;
    nombre_rol: string;
    estado_rol: boolean;
    permisos_rol: Permiso[];
  }
  
  export interface Permiso {
    nombre_permiso: string;
    _id: string;
  }
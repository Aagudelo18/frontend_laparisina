export interface Permiso {
  nombre_permiso?: string;
}
export interface Roles {
  _id?: string;
  nombre_rol?: string;
  estado_rol?: boolean;
  permisos_rol?: Permiso[];
}
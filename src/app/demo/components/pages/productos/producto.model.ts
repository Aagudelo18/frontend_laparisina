export interface Producto {
  _id?: string; // El identificador puede estar presente o no al crear un nuevo producto
  codigo_producto?: string;
  nombre_producto?: string;
  nombre_categoria_producto?: string;
  descripcion_producto?: string;
  precio_ico?: number;
  precio_por_mayor_ico?: number;
  durabilidad_producto?: string;
  imagenes_producto?: string[]; // El signo de interrogación indica que este campo es opcional
  estado_producto?: boolean;
}

  
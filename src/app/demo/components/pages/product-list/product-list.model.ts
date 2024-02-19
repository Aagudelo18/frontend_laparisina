export interface Product {
  _id?: string; // El identificador puede estar presente o no al crear un nuevo producto
  codigo_producto?: string;
  nombre_producto?: string;
  nombre_categoria_producto?: string;
  descripcion_producto?: string;
  precio_ico?: number;
  precio_por_mayor_ico?: number;
  cantidad_producto?: number;
  precio_total_producto?:number;
  durabilidad_producto?: string;
  imagenes_producto?: string[]; // El signo de interrogación indica que este campo es opcional
  estado_producto?: boolean;
};

export interface ProductoCarrito {
  nombre_producto: string;
  cantidad_producto: number;
  estado_producto: string;
  precio_ico: number;
  precio_por_mayor_ico: number;
  precio_total_producto: number;
}

  
export interface OrdenDeProduccion {
  _id?: string;
  nombre_area?: string;
  nombre_producto?: string;
  cantidad_producto?: number;
  fecha_actualizacion_estado?: string;
  fecha_entrega_pedido?: string;
  estado_orden?: string;
  pedidos_orden?: string[];
}

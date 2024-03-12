export interface Pedido {
    codigo_cliente: string;
    nombre_cliente: string;
    telefono_cliente: string;
    quien_recibe: string;
    direccion_entrega: string;
    edificio_apto_barrio: string;
    ciudad: string;
    fecha_entrega_pedido: string;
    estado_pedido: string;
    subtotal_venta: number;
    precio_total_venta: number;
    iva_pedido: number;
    aumento_empresa: number;
    metodo_pago: string;
    estado_pago: string;
    tipo_entrega: string;
    detalle_pedido: DetallePedido[];
  }
  
  export interface DetallePedido {
    nombre_producto: string;
    nombre_categoria_producto: string;
    fecha_pedido_tomado: string;
    cantidad_producto: number;
    estado_producto: string;
    precio_ico: number;
    precio_total_producto: number;
  }
  
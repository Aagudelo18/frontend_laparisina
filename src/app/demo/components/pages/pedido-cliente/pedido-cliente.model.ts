export interface Pedido {
    _id: string;
    documento_cliente: string;
    tipo_cliente: string;
    nombre_contacto: string;
    telefono_cliente: string;
    quien_recibe: string;
    direccion_entrega: string;
    ciudad_cliente: string;
    barrio_cliente: string;
    fecha_entrega_pedido: string;
    estado_pedido: string;
    precio_total_venta: number;
    subtotal_venta: number;
    iva_pedido: number;
    metodo_pago: string;
    tipo_entrega: string;
    valor_domicilio?: number;
    nit_empresa_cliente?: string;
    nombre_juridico?: string;
    aumento_empresa?: number;
    detalle_pedido: DetallePedido[];
  }
  
  export interface DetallePedido {
    _id: string;
    nombre_producto: string;
    nombre_categoria_producto: string;
    cantidad_producto: number;
    estado_producto: string;
    precio_ico: number;
    precio_por_mayor_ico?: number;
    precio_total_producto: number;
  }
  
  // Ahora, puedes importar este modelo en tu servicio o componente de Angular.
  
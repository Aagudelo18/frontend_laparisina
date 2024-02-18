import { Component, OnInit } from '@angular/core';
import { PedidoClienteService } from './pedido-cliente.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';



@Component({
    selector: 'app-pedido-cliente',
    templateUrl: './pedido-cliente.component.html',
    styleUrls: ['./pedido-cliente.component.scss'],
})
export class PedidoClienteComponent implements OnInit {
    clienteExistente: boolean = false;
    pedido: FormGroup;
    productosCarrito: any[] = [];
    cliente: any;

    constructor(
        
        private pedidoClienteService: PedidoClienteService,
        private fb: FormBuilder,
       
    ) {
        this.productosCarrito = pedidoClienteService.obtenerCarrito();

        this.pedido = this.fb.group({
            documento_cliente: new FormControl(''),
            nombre_contacto: new FormControl(''),
            quien_recibe: new FormControl(''),
            ciudad_cliente: new FormControl(''),
            barrio_cliente: new FormControl(''),
            direccion_entrega: new FormControl(''),
            fecha_entrega: new FormControl(''),
            metodo_pago: new FormControl('')
        });
    }

    obtenerDatosCliente(correo_cliente: string): void {
      this.pedidoClienteService.obtenerClientePorCorreo(correo_cliente).subscribe(
          (data: any) => {
              this.cliente = data;
              // Asignar valores del cliente a los controles del formulario
              this.pedido.get('nombre_contacto').setValue(data.nombre_contacto);
              this.pedido.get('documento_cliente').setValue(data.numero_documento_cliente);
              this.pedido.get('quien_recibe').setValue(data.nombre_contacto); // Otra propiedad del cliente según tus necesidades
              this.pedido.get('ciudad_cliente').setValue(data.ciudad_cliente);
              this.pedido.get('barrio_cliente').setValue(data.barrio_cliente);
              this.pedido.get('direccion_entrega').setValue(data.direccion_cliente);
              // Otros campos del formulario según los datos del cliente...
          },
          (error) => {
              console.error(error);
              // Manejar errores según sea necesario
          }
      );
  }
  

    ngOnInit() {   
      this.obtenerDatosCliente('11arangoa@gmail.com')
    }
}

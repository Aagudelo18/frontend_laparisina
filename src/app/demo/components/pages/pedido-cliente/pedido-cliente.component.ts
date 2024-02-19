import { Component, OnInit } from '@angular/core';
import { PedidoClienteService } from './pedido-cliente.service'; // Importa el servicio si es necesario


@Component({
    selector: 'app-pedido-cliente',
    templateUrl: './pedido-cliente.component.html',
    styleUrls: ['./pedido-cliente.component.scss'],
})
export class PedidoClienteComponent implements OnInit {

    productosCarrito: any [] = [];
    constructor(private pedidoClienteService: PedidoClienteService,
       ) {
        this.productosCarrito = pedidoClienteService.obtenerCarrito();
       }

    

    ngOnInit() {
       
    }
}

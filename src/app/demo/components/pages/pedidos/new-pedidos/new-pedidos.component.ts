import { Component, OnInit } from '@angular/core';
import { NewPedidosService } from './new-pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './new-pedidos.model';

@Component({
  selector: 'app-new-pedidos',
  templateUrl: './new-pedidos.component.html',
  styleUrls: ['./new-pedidos.component.scss']
})
export class NewPedidosComponent implements OnInit{
cities: any;

  constructor(
    private newpedidosService: NewPedidosService,
    private router: Router
    ) {}

    pedido: any = {
      codigo_cliente: '',
      nombre_recibe: '',
      nombre_cliente: '',
      telefono_cliente: '',
      direccion_entrega: '',
      edificio_apto_barrio: '',
      ciudad: '',
      fecha_entrega_pedido: '',
      estado_pedido: ''
    }

    ngOnInit() {
      };
    }



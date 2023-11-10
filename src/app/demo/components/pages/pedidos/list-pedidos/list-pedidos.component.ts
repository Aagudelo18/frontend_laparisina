import { Component, OnInit } from '@angular/core';
import { PedidosService } from './pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from './pedidos.model';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.component.html',
  styleUrls: ['./list-pedidos.component.scss']
})
export class ListPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  selectedPedidos: Pedido[] = [];

  roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  // Función para abrir el diálogo de creación de rol

  openNewPedidos() {
    this.router.navigate(['/new-pedidos'])
  }
  
  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    ) { }
    
  ngOnInit() {
    this.pedidosService.getPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
    });
  }
}

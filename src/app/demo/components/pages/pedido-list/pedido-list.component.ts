import { Component, OnInit } from '@angular/core';
import { PedidoListService } from './pedido-list.service';


@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.scss'],

})
export class PedidoListComponent implements OnInit {

constructor(private pedidoListService: PedidoListService,
  
  ) {}


  ngOnInit() {
       
  }

}

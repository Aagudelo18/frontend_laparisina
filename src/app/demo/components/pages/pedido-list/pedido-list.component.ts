import { Component, OnInit } from '@angular/core';
import { PedidoListService } from './pedido-list.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.scss'],
  providers: [MessageService]
})
export class PedidoListComponent implements OnInit {

constructor(private pedidoListService: PedidoListService,
  private messageService: MessageService,
  ) {}


  ngOnInit() {
       
  }

}

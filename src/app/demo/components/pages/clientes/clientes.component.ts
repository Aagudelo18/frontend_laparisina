import { Component, OnInit } from '@angular/core';
import { ClientesService } from './clientes.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
 
@Component({
    templateUrl: './clientes.component.html',
    providers: [ClientesService, MessageService]
})
export class clientesComponent implements OnInit {
    clientes: any[] = [];
    selectedClientes: any[] = [];
  
    clientesDialog: boolean = false; // Esto controla la visibilidad del p-dialog
    // Función para abrir el diálogo de creación de rol
    openNewClientesDialog() {
      this.clientesDialog = true;
    }
    constructor(private clientesService:ClientesService) { }
      
    ngOnInit() {
      this.clientesService.getClientes().subscribe((data: any[]) => {
        this.clientes = data;
      });
    }
}
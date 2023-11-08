import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuarios.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


@Component({
  templateUrl: './usuarios.component.html',
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  selectedUsuarios: any[] = [];

  usuarioDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  // Función para abrir el diálogo de creación de usuario
  openNewUsuarioDialog() {
    this.usuarioDialog = true;
  }
  constructor(private usuarioService: UsuarioService) { }
    
  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.total) {
        this.usuarios = data.total;
        console.log(this.usuarios)
      }
    });
    
  }
}
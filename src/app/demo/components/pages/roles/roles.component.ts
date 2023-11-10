import { Component, OnInit } from '@angular/core';
import { RolesService } from './roles.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


@Component({ 
  templateUrl: './roles.component.html',
  providers: [RolesService]
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  selectedRoles: any[] = [];
  crearCategoriaDialog: boolean = false;
  openNewCategoriaDialog() {
      this.crearCategoriaDialog = true;
    }

  editarCategoriaDialog: boolean = false;
  openEditarCategoriaDialog() {
      this.editarCategoriaDialog = true;
    }
  rolesDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  // Función para abrir el diálogo de creación de rol
  openNewRolesDialog() {
    this.rolesDialog = true;
  }
  constructor(private rolesService: RolesService) { }
    
  ngOnInit() {
    this.rolesService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }
}
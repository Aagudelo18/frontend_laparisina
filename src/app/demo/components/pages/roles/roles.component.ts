import { Component, OnInit } from '@angular/core';
import { RoleService } from './roles.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


@Component({
  templateUrl: './roles.component.html',
  providers: [RoleService]
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  selectedRoles: any[] = [];

  roleDialog: boolean = false; // Esto controla la visibilidad del p-dialog
  // Función para abrir el diálogo de creación de rol
  openNewRoleDialog() {
    this.roleDialog = true;
  }
  constructor(private roleService: RoleService) { }
    
  ngOnInit() {
    this.roleService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }
}
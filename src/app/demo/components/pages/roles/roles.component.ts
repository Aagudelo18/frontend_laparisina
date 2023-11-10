// import { Component, OnInit } from '@angular/core';
// import { RolesService } from './roles.service';


// @Component({ 
//   templateUrl: './roles.component.html',
//   providers: [RolesService]
// })
// export class RolesComponent implements OnInit {
//   roles: any[] = [];
//   selectedRoles: any[] = [];

//   rolesDialog: boolean = false; // Esto controla la visibilidad del p-dialog
//   // Función para abrir el diálogo de creación de rol
//   openNewRolesDialog() {
//     this.rolesDialog = true;
//   }
//   constructor(private rolesService: RolesService) { }
    
  ngOnInit() {
    this.rolesService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }
}
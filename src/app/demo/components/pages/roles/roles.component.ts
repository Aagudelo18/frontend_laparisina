import { Component, OnInit } from '@angular/core';
import { RolesService } from './roles.service';
import { Rol } from './roles.model';

@Component({ 
  templateUrl: './roles.component.html',
  providers: [RolesService]
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  selectedRoles: Rol[] = [];

  rolesDialog: boolean = false;
  displayConfirmationDialog: boolean = false;
  rolACambiar: Rol; // Propiedad para guardar el rol que se va a cambiar

  constructor(private rolesService: RolesService) { }
    
  ngOnInit() {
    this.rolesService.getRoles().subscribe((data: Rol[]) => {
      this.roles = data;
    });
  }

  mostrarDialogConfirmacion(rol: Rol) {
    // Mostrar el diálogo de confirmación antes de cambiar el estado
    this.rolACambiar = rol;
    this.displayConfirmationDialog = true;
  }

  confirmarCambioEstado() {
    // Realiza el cambio de estado en la API
    this.rolesService.cambiarEstadoRol(this.rolACambiar._id).subscribe(() => {
      // Actualiza el estado del rol localmente
      const index = this.roles.indexOf(this.rolACambiar);
      if (index !== -1) {
        this.roles[index].estado_rol = !this.roles[index].estado_rol;
      }
      // Cierra el diálogo de confirmación
      this.displayConfirmationDialog = false;
    });
  }

  cancelarCambioEstado() {
    // Cancela la operación y cierra el diálogo de confirmación
    this.displayConfirmationDialog = false;
  }
}

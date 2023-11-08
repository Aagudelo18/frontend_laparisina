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
  usuarioDialog: boolean = false;

  // Datos del nuevo usuario
  nuevoUsuario: any = {
    correo_electronico: '',
    contrasena_usuario: '',
    rol_usuario: '', // Debes asignar el ID del rol
    estado_usuario: true
  };

  constructor(private usuarioService: UsuarioService, private messageService: MessageService) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.usuarios) {
        this.usuarios = data.usuarios;
      }
    });
  }

  // Función para abrir el diálogo de creación de usuario
  openNewUsuarioDialog() {
    this.usuarioDialog = true;
  }

  // Crear un nuevo usuario
  crearUsuario() {
    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe(
      (data: any) => {
        // Limpia los datos del nuevo usuario
        this.nuevoUsuario = {
          correo_electronico: '',
          contrasena_usuario: '',
          rol_usuario: '',
          estado_usuario: true
        };
        this.usuarioDialog = false; // Cierra el diálogo
        this.obtenerUsuarios(); // Vuelve a cargar la lista de usuarios
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado con éxito' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el usuario' });
      }
    );
  }

  // Actualizar un usuario
  actualizarUsuario(usuario: any) {
    this.usuarioService.updateUsuario(usuario._id, usuario).subscribe(
      (data: any) => {
        this.obtenerUsuarios(); // Vuelve a cargar la lista de usuarios
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado con éxito' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario' });
      }
    );
  }

  // Eliminar un usuario
  eliminarUsuario(usuario: any) {
    this.usuarioService.deleteUsuario(usuario._id).subscribe(
      (data: any) => {
        this.obtenerUsuarios(); // Vuelve a cargar la lista de usuarios
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado con éxito' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario' });
      }
    );
  }
}

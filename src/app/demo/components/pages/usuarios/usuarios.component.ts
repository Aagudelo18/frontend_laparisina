import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuarioService } from './usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Usuario } from './usuarios.model';



@Component({
  templateUrl: './usuarios.component.html',
  providers: [UsuarioService, MessageService]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  selectedUsuarios: any[] = [];
  roles: any[] = []; // Se declara una lista para roles
  selectedRol: any; // Variable para almacenar el rol seleccionado
  correoBusqueda: string = '';
  editarUsuarioDialog: boolean = false;
  mostrarConfirmacionUsuario = false; // Variable para controlar la visibilidad del diálogo de confirmación
  usuarioAEditar: any;
  usuario: any;
  formularioUsuario: FormGroup;
  formularioEditarUsuario: FormGroup;
  submitted: boolean = false;


  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.formularioUsuario = fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),]],
      confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
      rol_usuario: ['', [Validators.required]],// Establece el valor predeterminado a "Activo"
    });
    this.formularioEditarUsuario = fb.group({
      correo_electronico: [{ value: '', disabled: true }, ''],
      rol_usuario: ['', [Validators.required]],
      estado_usuario: [true, Validators.required],
    });
    this.submitted = false;
  }

  usuarioDialog: boolean = false;
  openNewUsuarioDialog() {
    this.usuarioDialog = true;
    this.formularioUsuario.reset();
  }

  ngOnInit() {
    //Traemos el método para traer todos los usuarios
    this.getListUsuarios();

    //Traemos el método para traer todos los roles
    this.getListRoles();
  }

  //Método para traer todos los usuarios. signIn
  getListUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.usuarios) {
        this.usuarios = data.usuarios;
      }
    });
  }

  //Método para traer todos los roles.
  getListRoles() {
    this.usuarioService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }

  //Abre o muestra el dialog o el modal del Editar Usuario
  openEditarUsuarioDialog() {
    this.editarUsuarioDialog = true;
  }

  //Método para cambiar que los estados sean estados booleanos y se vean como "true" y "false" para que se vean como "Activos" e "Inactivos"
  estadoOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  // sortColumn(columnName: string) {
  //   // Aquí puedes implementar la lógica de ordenamiento
  //   this.usuarios.sort((a, b) => {
  //     // Ordenamiento ascendente por correo electrónico
  //     if (columnName === 'correo_electronico') {
  //       return a.correo_electronico.localeCompare(b.correo_electronico);
  //     }
  //     //Organizar los usuarios por medio del estado
  //     if (columnName === 'estado_usuario') {
  //       const stateA = a.estado_usuario ? 'Activo' : 'Inactivo';
  //       const stateB = b.estado_usuario ? 'Activo' : 'Inactivo';
  //       return stateA.localeCompare(stateB);
  //     }
  //   });
  // }



  //Metodo para buscar por medio del correo electrónico
  onBuscar() {
    // Obtener la lista completa de usuarios desde donde se esté almacenando
    const usuariosCompletos = this.usuarios;
    // Realizar la búsqueda por correo electrónico
    this.usuarios = usuariosCompletos.filter(usuario =>
      usuario.correo_electronico.toLowerCase().includes(this.correoBusqueda.toLowerCase())
    );
  }

  //Verifica o se asegura de que el campo de confirmar contraseña coincida con la contraseña.
  validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
    const contrasena = control.root.get('contrasena_usuario');
    const confirmarContrasena = control.value;

    if (contrasena && contrasena.value !== confirmarContrasena) {
      return { contrasenaNoCoincide: true };
    }

    return null;
  }

  //Método para crear el usuario por medio del formulario válido.
  crearUsuario() {
    if (this.formularioUsuario.valid) {
      if (this.formularioUsuario.controls['contrasena_usuario'].value === this.formularioUsuario.controls['confirmar_contrasena'].value) {
        this.mostrarConfirmacionUsuario = true; // Mostrar el diálogo de confirmación
      }
    }
  }

  //Se abre un modal o dialog para confirmar o asegurarse de la creación de un usuario.
  confirmarCrearUsuario() {
    if (this.formularioUsuario.valid) {
      const nuevoUsuario = this.formularioUsuario.value;

      // Verifica la igualdad de contraseñas antes de enviar la solicitud para crear el usuario
      if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
        this.usuarioService.createUsuario(nuevoUsuario).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'El usuario fue creado con éxito',
              detail: 'Usuario creado',
              life: 3000
            });
            this.getListUsuarios();
            this.getListRoles();
            this.usuarioDialog = false;
            this.mostrarConfirmacionUsuario = false; // Cerrar el diálogo de confirmación
          },
          (error) => {
            if (error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el usuario',
                detail: errorMessage,
                life: 5000
              });
            } else {
              console.error('Error desconocido al crear el usuario:', error);
            }
          }
        );
      } else {
        // Si las contraseñas no coinciden, puedes mostrar un mensaje de error o tomar alguna acción
        // Por ejemplo:
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseñas no coinciden al confirmar',
          life: 3000
        });
      }
    }
  }

  //Método par apoder filtrar, o el campo de buscador.
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Método para mostrar el diálogo de edición
  mostrarEditarUsuarioDialog() {
    this.editarUsuarioDialog = true;
  }

  // Método para habilitar la edición de un usuario específico
  editarUsuario(usuarioAEditar) {
    this.usuarioAEditar = usuarioAEditar;

    // Llenar el formulario de edición con los datos del usuario seleccionado
    this.formularioEditarUsuario.patchValue({
      correo_electronico: usuarioAEditar.correo_electronico,
      rol_usuario: usuarioAEditar.rol_usuario,
      estado_usuario: usuarioAEditar.estado_usuario
    });

    // Mostrar el diálogo de edición
    this.editarUsuarioDialog = true;
  }

  //Método para actualizar el usuario.
  actualizarUsuario() {
    if (this.usuarioAEditar) {
      const { correo_electronico, rol_usuario, estado_usuario } = this.formularioEditarUsuario.value;

      this.usuarioService.updateUsuario(this.usuarioAEditar.uid, {
        correo_electronico,
        rol_usuario,
        estado_usuario,
      }).subscribe((respuesta: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'El usuario fue editado con éxito',
          detail: 'Usuario Editado',
          life: 3000
        });
        console.log('Los datos se han actualizado correctamente.', respuesta);
        this.getListUsuarios();
        this.getListRoles();
        this.editarUsuarioDialog = false;
      });
    } else (error) => {
      if (error.error && error.error.error) {
        const errorMessage = error.error.error;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar el usuario',
          detail: errorMessage,
          life: 5000
        });
        console.error('El usuario no está definido.');

      }
    }
  }


}

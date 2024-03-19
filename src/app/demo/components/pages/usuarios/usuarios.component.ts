import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioService } from './usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
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
  rolesForCreation: any[] = [];
  selectedRol: any; // Variable para almacenar el rol seleccionado
  correoBusqueda: string = '';
  editarUsuarioDialog: boolean = false;
  mostrarConfirmacionUsuario = false; // Variable para controlar la visibilidad del diálogo de confirmación
  estadoUsuarioDialog: boolean = false;
  usuarioAEditar: any;
  usuario: any;
  formularioUsuario: FormGroup;
  formularioEditarUsuario: FormGroup;
  submitted: boolean = false;
  isRequired: boolean = true;
  showPassword: boolean = false;
  showPassword2: boolean = false;


  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.formularioUsuario = fb.group({
      nombre_usuario: ['', [Validators.minLength(2), Validators.maxLength(25), Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s\D]{1,25}$/), this.noCaracteresEspeciales()]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,15}$/),]],
      confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
      rol_usuario: ['', [Validators.required]],// Establece el valor predeterminado a "Activo"
    });
    this.formularioEditarUsuario = fb.group({
      nombre_usuario: ['', [Validators.minLength(2), Validators.maxLength(25), Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s\D]{1,25}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      rol_usuario: [{ value: '', disabled: true }, [Validators.required]],
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
    this.getListRolesForCreation();
  }

  // Método para traer todos los usuarios.
  getListUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.usuarios) {
        // Filtrar los usuarios para excluir aquellos con roles "Cliente" y "Empleado"
        this.usuarios = data.usuarios.filter(usuario => {
          return usuario.rol_usuario && usuario.rol_usuario.nombre_rol !== 'Cliente' && usuario.rol_usuario.nombre_rol !== 'Empleado';
        });
      }
    });
  }

  getListRolesForCreation() {
    this.usuarioService.getRoles().subscribe((data: any[]) => {
      // Filtrar los roles para mostrar solo el rol de Administrador para la creación
      this.rolesForCreation = data.filter(rol => {
        // Excluir roles con nombre "Cliente" y "Empleado"
        return rol.nombre_rol !== 'Cliente' && rol.nombre_rol !== 'Empleado' && rol.nombre_rol !== 'Super Admin';
      });
    });
  }

  //Método para traer todos los roles.
  getListRoles() {
    this.usuarioService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
    });
  }

  noCaracteresEspeciales(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const caracteresEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
      if (caracteresEspeciales.test(control.value)) {
        return { 'caracteresEspeciales': true };
      }
      return null;
    };
  }

  togglePasswordVisibility(controlName: string): void {
    const control = this.formularioUsuario.get(controlName);
    if (control) {
      const inputField = document.getElementById(controlName) as HTMLInputElement;
      if (inputField) {
        inputField.type = this.showPassword ? 'password' : 'text';
        this.showPassword = !this.showPassword;
      }
    }
  }

  togglePasswordVisibility2(controlName: string): void {
    const control = this.formularioUsuario.get(controlName);
    if (control) {
      const inputField = document.getElementById(controlName) as HTMLInputElement;
      if (inputField) {
        inputField.type = this.showPassword2 ? 'password' : 'text';
        this.showPassword2 = !this.showPassword2;
      }
    }
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

      if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
        this.usuarioService.createUsuario(nuevoUsuario)
          .subscribe(
            (response: any) => {
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
              if (error && error.error && error.error.errors && error.error.errors.length > 0) {
                const errorMessage = error.error.errors[0].msg; // Acceder al mensaje de error específico
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error al crear el usuario',
                  detail: errorMessage,
                  life: 5000
                });
              } else {
                let errorMessage = 'Usuario no creado'; // Mensaje predeterminado en caso de que no se encuentre un mensaje específico
                if (error && error.error && error.error.msg) {
                  errorMessage = error.error.msg; // Accede al mensaje de error específico del servidor
                }
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error al crear el usuario',
                  detail: errorMessage,
                  life: 6000
                });
              }
            }
          );
      } else {
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
      nombre_usuario: usuarioAEditar.nombre_usuario,
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
      const { nombre_usuario, correo_electronico, rol_usuario, estado_usuario } = this.formularioEditarUsuario.value;

      this.usuarioService.updateUsuario(this.usuarioAEditar.uid, {
        nombre_usuario,
        correo_electronico,
        rol_usuario,
        estado_usuario,
      })
        .pipe(
          catchError(error => {
            if (error && error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error al actualizar el usuario',
                detail: errorMessage,
                life: 5000
              });
            } else {
              let errorMessage = 'Usuario no creado'; // Mensaje predeterminado en caso de que no se encuentre un mensaje específico
              if (error && error.error && error.error.msg) {
                errorMessage = error.error.msg; // Accede al mensaje de error específico del servidor
              }
              this.messageService.add({
                severity: 'error',
                summary: 'Error al editar el usuario',
                detail: errorMessage,
                life: 6000
              });
            }
            return throwError(error); // Propaga el error
          })
        )
        .subscribe((respuesta: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'El usuario fue editado con éxito',
            detail: 'Usuario Editado',
            life: 3000
          });
          this.getListUsuarios();
          this.getListRoles();
          this.editarUsuarioDialog = false;
        });
    } else {
      console.error('El usuario no está definido.');
    }
  }

  // Función para confirmar cambiar el estado de una categoría
  confirmarCambioEstado(usuario: Usuario) {
    this.estadoUsuarioDialog = true;
    this.usuario = usuario
  }

  // Función para cambiar el estado de un usuario
  cambiarEstadoUsuario(uid: string, nuevoEstado: boolean) {
    const usuarioData = {
      estado_usuario: nuevoEstado
    };

    this.usuarioService.actualizarEstadoUsuario(uid, usuarioData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'El estado del usuario fue cambiado con éxito',
          life: 3000
        });
        this.estadoUsuarioDialog = false;
      },
      error: (error) => {
        let errorMessage = 'Usuario no editado'; // Mensaje predeterminado en caso de que no se encuentre un mensaje específico
        if (error && error.error && error.error.msg) {
          errorMessage = error.error.msg; // Accede al mensaje de error específico del servidor
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cambiar el estado del usuario',
          detail: errorMessage,
          life: 6000
        });
        console.error('Error cambiando el estado del usuario:', error);
        // Manejar errores según sea necesario
      }
    });
  }

  //Función para no cambiar el estado de una categoría
  noCambiarEstado() {
    this.estadoUsuarioDialog = false;
    this.getListUsuarios();
  }

}

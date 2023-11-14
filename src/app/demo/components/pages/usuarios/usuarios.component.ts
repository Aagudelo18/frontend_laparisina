import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from './usuarios.service';
import { RolesService } from './usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  templateUrl: './usuarios.component.html',
  providers: [UsuarioService, RolesService]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  selectedUsuarios: any[] = [];
  roles: any[] = []; // Se declara una lista para roles
  usuarioDialog: boolean = false;
  formularioUsuario: FormGroup;
  selectedRol: any; // Variable para almacenar el rol seleccionado
  correoBusqueda: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private fb: FormBuilder
  ) {
    this.formularioUsuario = fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6)]],
      rol_usuario: ['', [Validators.required]],
      estado_usuario: [true, Validators.required], // Establece el valor predeterminado a "Activo"
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.total) {
        this.usuarios = data.total;
        console.log(this.usuarios);
      }
    });

    this.rolesService.getRoles().subscribe((data: any[]) => {
      this.roles = data;
      console.log(data);
    });
  }

  openNewUsuarioDialog() {
    this.usuarioDialog = true;
  }

  estadoOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  //Metodo para buscar por medio del correo electrónico
  onBuscar() {
    // Obtener la lista completa de usuarios desde donde se esté almacenando
    const usuariosCompletos = this.usuarios;

    // Realizar la búsqueda por correo electrónico
    this.usuarios = usuariosCompletos.filter(usuario =>
      usuario.correo_electronico.toLowerCase().includes(this.correoBusqueda.toLowerCase())
    );
  }

  crearUsuario() {
    if (this.formularioUsuario.valid) {
      const nuevoUsuario = this.formularioUsuario.value;

      // Asigna el objeto completo del rol seleccionado al objeto nuevoUsuario
      nuevoUsuario.rol_usuario = this.selectedRol;

      console.log('Rol seleccionado:', this.selectedRol);
      console.log('Nuevo Usuario:', nuevoUsuario);

      this.usuarioService.createUsuario(nuevoUsuario).subscribe((response: any) => {
        console.log('Usuario creado con éxito:', response);

        // Vuelve a cargar la lista de usuarios después de crear uno nuevo
        this.usuarioService.getUsuarios().subscribe((data: any) => {
          if (data && data.total) {
            this.usuarios = data.total;
            console.log(this.usuarios);
          }
        });

        this.usuarioDialog = false;
      });
    }
  }
}

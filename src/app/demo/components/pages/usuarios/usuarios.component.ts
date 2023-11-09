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
  roles: any[] = []; //Se declara una lista para roles
  rolesList: string[] = []; // Declaramos la propiedad rolesList
  usuarioDialog: boolean = false;
  formularioUsuario: FormGroup;

  hideUsuarioDialog() {
    this.usuarioDialog = false;
  }


  constructor(private usuarioService: UsuarioService, private rolesService: RolesService, private fb: FormBuilder) {
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

      // Crea la lista de roles
      const rolesList = this.roles.map((rol: any) => rol.nombre_rol);
      
      // Asigna la lista de roles a la propiedad roles
      this.rolesList = rolesList;
      console.log(rolesList);
    });
  }


  openNewUsuarioDialog() {
    this.usuarioDialog = true;
  }

  estadoOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];


  crearUsuario() {
    if (this.formularioUsuario.valid) {
      const nuevoUsuario = this.formularioUsuario.value;

      // Obtiene el nombre del rol seleccionado
      const rolSeleccionado = this.rolesList[this.formularioUsuario.get('rol_usuario').value];

      // Asigna el nombre del rol seleccionado al objeto nuevoUsuario
      nuevoUsuario.rol_usuario = rolSeleccionado;

      this.usuarioService.createUsuario(nuevoUsuario).subscribe((response: any) => {
        console.log('Usuario creado con éxito:', response);
        this.usuarioDialog = false;
      });
    }
  }
  
  


}

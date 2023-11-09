import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from './usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  templateUrl: './usuarios.component.html',
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  selectedUsuarios: any[] = [];
  usuarioDialog: boolean = false;
  formularioUsuario: FormGroup;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    this.formularioUsuario = fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena_usuario: ['', [Validators.required, Validators.minLength(6)]],
      rol_usuario: ['', Validators.required],
      estado_usuario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: any) => {
      if (data && data.total) {
        this.usuarios = data.total;
        console.log(this.usuarios);
      }
    });
  }

  openNewUsuarioDialog() {
    this.usuarioDialog = true;
  }

  crearUsuario() {
    if (this.formularioUsuario.valid) {
      const nuevoUsuario = this.formularioUsuario.value;
      this.usuarioService.createUsuario(nuevoUsuario).subscribe((response: any) => {
        console.log('Usuario creado con éxito:', response);
        this.usuarioDialog = false;
        // Puedes agregar lógica adicional aquí, como actualizar la lista de usuarios.
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { RolesService } from './roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Permiso,Roles } from './roles.model';
import { Table } from 'primeng/table';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



@Component({ 
  templateUrl: './roles.component.html',
  providers: [MessageService]
})
export class RolesComponent implements OnInit {
  selectedRoles: { nombre_permiso: string }[] = [
    { nombre_permiso: 'Dashboard' },
    { nombre_permiso: 'Roles' },
    { nombre_permiso: 'Usuarios' },
    { nombre_permiso: 'Usuarios Cliente' },
    { nombre_permiso: 'Categorias' },
    { nombre_permiso: 'Categorias Cliente' },
    { nombre_permiso: 'Productos' },
    { nombre_permiso: 'Productos Cliente' },
    { nombre_permiso: 'Empleados' },
    { nombre_permiso: 'Clientes' },
    { nombre_permiso: 'Transportes' },
    { nombre_permiso: 'Pedidos' },
    { nombre_permiso: 'Pedidos Empleado' },
    { nombre_permiso: 'Pedidos Cliente' },
    { nombre_permiso: 'Orden de produccion' },
    { nombre_permiso: 'Orden de produccion Empleado' },
    { nombre_permiso: 'Ventas' },
  ];

  listRoles: Roles[] = []
  rol: Roles = {}
  formRoles:FormGroup;
  id: string = '';

  crearRolDialog: boolean = false;
  editarRolDialog: boolean = false;
  estadoRolDialog: boolean = false;

  
  estado:SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  selectedEstado: SelectItem = {value: ''};

  atLeastOneCheckboxSelectedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const selectedCheckboxes = Object.values(control.value).some((value: string) => value === 'true');
    return selectedCheckboxes ? null : { atLeastOneCheckboxSelected: true };
  };

  constructor(private fb:FormBuilder,
    private rolesService: RolesService,
    private messageService: MessageService,
    private router:Router,
    private aRouter:ActivatedRoute){
      this.formRoles = this.fb.group({
        nombre_rol: ['',[Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{3,20}$/),]],
        estado_rol: [true,Validators.required],
        permisos_rol: [],
      }, { validators: this.atLeastOneCheckboxSelectedValidator });
      this.aRouter.params.subscribe(params => {
        this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
      });
     }


  ngOnInit():void {        
      this.getListRoles();
      for (const rol of this.selectedRoles) {
        this.formRoles.addControl(rol.nombre_permiso, this.fb.control(false));
      }  
         
  }

  getListRoles(){     
    this.rolesService.getListRoles().subscribe((data) =>{      
      this.listRoles = data;        
    })        
}

 
getRoles(id: string) {
  this.rolesService.getRoles(id).subscribe((data: Roles) => {
    this.formRoles = this.fb.group({
      nombre_rol: [data.nombre_rol, Validators.required],
      estado_rol: [data.estado_rol, Validators.required],
    });

    // Agregar controles dinámicos para cada permiso
    for (const rol of this.selectedRoles) {
      const isChecked = data.permisos_rol && data.permisos_rol.some(p => p.nombre_permiso === rol.nombre_permiso);
      this.formRoles.addControl(rol.nombre_permiso, this.fb.control(isChecked));
    }
  });
}
alMenosUnPermisoSeleccionadoYNombreLleno(): boolean {
  const nombreRolControl = this.formRoles.get('nombre_rol');
  const alMenosUnPermisoSeleccionado = this.selectedRoles.some(rol => this.formRoles.get(rol.nombre_permiso)?.value);
  return nombreRolControl?.valid && nombreRolControl?.value !== '' && alMenosUnPermisoSeleccionado;
}
// Función para crear un rol 
crearRol() {
  const nombreRol = this.formRoles.value.nombre_rol;

  // Verificar si el nombre del rol ya existe en la lista de roles actual
  const rolExistente = this.listRoles.find(rol => rol.nombre_rol === nombreRol);
  if (rolExistente) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al crear el rol',
      detail: 'El nombre del rol ya existe.',
      life: 6000
    });
    return; // Detener la ejecución de la función si el rol ya existe
  }

  // Verificar si el nombre del rol ya existe en la lista de roles actual
  if (nombreRol === '') {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al crear el rol',
      detail: 'El nombre del rol es obligatorio.',
      life: 6000
    });
    return; // Detener la ejecución de la función si el rol ya existe
  }
  // Verifica si al menos un permiso está seleccionado
  const alMenosUnPermisoSeleccionado = this.selectedRoles.some(rol => this.formRoles.get(rol.nombre_permiso)?.value);

  if (!alMenosUnPermisoSeleccionado) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al crear el rol',
      detail: 'El rol debe tener al menos un permiso asociado.',
      life: 6000
    });
    return; // Detiene la ejecución de la función
  }
  const permisosRol: Permiso[] = this.selectedRoles
  .filter(rol => this.formRoles.get(rol.nombre_permiso)?.value)
  .map(rol => ({ nombre_permiso: rol.nombre_permiso }));

  
const nuevoRol: Roles = {
  nombre_rol: this.formRoles.value.nombre_rol,
  estado_rol: true,
  permisos_rol: permisosRol,
};

  this.rolesService.postRoles(nuevoRol).subscribe(() => {
    this.messageService.add({
      severity: 'success',
      summary: '¡El Rol fue creado con éxito!',
      detail: 'Rol creado',
      life: 6000
    });
    this.getListRoles();
    this.crearRolDialog = false;
  });
}

 // Función para actualizar un rol
 actualizarRol() {
  const nuevoNombreRol = this.formRoles.value.nombre_rol;

  // Verificar si el nuevo nombre ya existe en la lista de roles
  const rolExistente = this.listRoles.find(rol => rol.nombre_rol === nuevoNombreRol);

  if (rolExistente && rolExistente._id !== this.id) { // Evitar comparar el mismo rol consigo mismo
    this.messageService.add({
      severity: 'error',
      summary: 'Error al editar el rol',
      detail: 'El nuevo nombre de rol ya está en uso.',
      life: 6000
    });
    return; // Detener la ejecución de la función si el nuevo nombre ya existe
  }

   // Verifica si el nombre del rol es 'Super Admin'
   if (this.formRoles.value.nombre_rol === 'Super Admin' || this.formRoles.value.nombre_rol === 'Empleado' || this.formRoles.value.nombre_rol === 'Cliente') {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al editar',
      detail: 'Los permisos de este rol no puede ser editado.',
      life: 6000
    });
    this.getListRoles();
    this.editarRolDialog = false;
    return; // Detiene la ejecución de la función
  }
  // Verifica si al menos un permiso está seleccionado
  const alMenosUnPermisoSeleccionado = this.selectedRoles.some(rol => this.formRoles.get(rol.nombre_permiso)?.value);

  if (!alMenosUnPermisoSeleccionado) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al crear el rol',
      detail: 'Debes seleccionar al menos un permiso.',
      life: 6000
    });
    return; // Detiene la ejecución de la función
  }

  const permisosRol: Permiso[] = this.selectedRoles
    .filter(rol => this.formRoles.get(rol.nombre_permiso)?.value)
    .map(rol => ({ nombre_permiso: rol.nombre_permiso }));

  const rolActualizado: Roles = {
    nombre_rol: this.formRoles.value.nombre_rol,
    estado_rol: this.formRoles.value.estado_rol,
    permisos_rol: permisosRol,
  };

  if (this.id !== '') {
    rolActualizado._id = this.id;
    this.rolesService.putRoles(this.id, rolActualizado).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'El rol fue actualizado con éxito',
        detail: 'Rol actualizado',
        life: 6000
      });
      this.getListRoles();
      this.editarRolDialog = false;
    });
  }
}


  // Función para confirmar cambiar el estado de un rol
  confirmarCambioEstado(rol: Roles) {
    this.estadoRolDialog = true;
    this.rol = rol
  }
   //Función para no cambiar el estado de un cliente
   noCambiarEstado() {
    this.estadoRolDialog = false;
    this.getListRoles();
  }
  
  cambiarEstadoRol(id: string, nombre_rol: string) {
    // Verificar si el nombre del rol está en la lista de roles que no se pueden editar
    if (nombre_rol === "Super Admin" || nombre_rol === "Empleado" || nombre_rol === "Cliente") {
      // Mostrar mensaje utilizando messageService
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Este rol no se puede editar el estado.',
        life: 3000
      });
      this.estadoRolDialog = false;
      return; // Salir de la función sin continuar
    }
  
    // Si el rol no está en la lista, continuar con la lógica para cambiar el estado
    this.rolesService.actualizarEstadoRol(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'El estado del rol fue cambiado con éxito',
          life: 3000
        }); 
        this.messageService.add({
          severity: 'info',
          summary: 'El estado de los usuarios asociados a este rol fueron cambiado con éxito',
          life: 3000
        });
        this.estadoRolDialog = false;
      },
      error: (error) => {
        console.error('Error cambiando el estado del rol:', error);
        // Manejar errores según sea necesario
      }
    });
  }
  
  openNewRolDialog() {
    this.id = '';                
    this.formRoles.reset()
    this.crearRolDialog = true;
}

openEditarRolDialog(id:string) {
    this.id = id;
    this.editarRolDialog = true;
    this.getRoles(id);
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

} 
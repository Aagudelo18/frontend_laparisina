import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.guard.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Roles } from '../../pages/roles/roles.model';
import { Usuario } from '../../pages/usuarios/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  usuarioEncontrado: Usuario;
  usuarios: Usuario[] = [];

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.authService.getRoles().pipe(
        switchMap((roles: Roles[]) => {
          // Obtener el rol del usuario actual
          const userRole = this.getCurrentUserRole(roles);
          if (!userRole) {
            console.log('No se encontró el rol del usuario.');
            this.router.navigate(['/error']); // Redirigir a una página de error
            return of(false);
          }

          const moduleName = route.data['moduleName'];; // Obtener el nombre del módulo desde los datos de la ruta
          if (!moduleName) {
            console.error('No se proporcionó un nombre de módulo en la ruta.');
            this.router.navigate(['/error']); // Redirigir a una página de error si no se proporciona el nombre del módulo
            return of(false);
          }

          if (this.hasRequiredPermission(userRole, moduleName)) {
            return of(true);
          } else {
            alert(`El usuario no tiene los permisos necesarios para acceder al módulo ${moduleName}. Denegando acceso.`)
            return of(false);
          }
        }),
        catchError(error => {
          console.error('Error al obtener roles:', error);
          this.router.navigate(['/error']); // Redirigir a una página de error en caso de error
          return of(false); // Denegar acceso a la ruta en caso de error
        })
      );
    } else {
      this.router.navigate(['/auth/login']); // Token no existe, redirige a la página de inicio de sesión
      return of(false); // Evita el acceso a la ruta protegida
    }
  }

  hasRequiredPermission(role: Roles, moduleName: string): boolean {
    const permissionName = `${moduleName}`; // Suponiendo que el nombre del permiso coincide con el nombre del módulo
    return this.hasPermission(role, permissionName);
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser'); // Recupera los datos del usuario del localStorage
    if (user) {
      this.currentUser = JSON.parse(user); // Asigna los datos del usuario a la variable
      const correo = this.currentUser.correo_electronico;
      this.usuarioEncontrado = this.usuarios.find(usuario => usuario.correo_electronico === correo);
    }
  }

  getCurrentUserRole(roles: Roles[]): Roles | undefined {
    // Implementa la lógica para obtener el rol del usuario actual
    // Por ejemplo, puedes buscar el rol por el nombre almacenado en localStorage
    const userRoleName = localStorage.getItem('rol');
    return roles.find(role => role.nombre_rol === userRoleName);
  }


  hasDashboardPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Usuarios"
    return this.hasPermission(role, 'Dashboard');
  }

  hasUsuariosPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Usuarios"
    return this.hasPermission(role, 'Usuarios');
  }

  hasRolesPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Roles"
    return this.hasPermission(role, 'Roles');
  }

  hasCategoriasPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Categorias"
    return this.hasPermission(role, 'Categorias');
  }

  hasCategoriasClientePermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Categorias"
    return this.hasPermission(role, 'Categorias Cliente');
  }

  hasProductosPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Productos"
    return this.hasPermission(role, 'Productos');
  }

  hasProductosClientePermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Productos"
    return this.hasPermission(role, 'Productos Cliente');
  }

  hasEmpleadosPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Empleados"
    return this.hasPermission(role, 'Empleados');
  }

  hasClientesPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Clientes"
    return this.hasPermission(role, 'Clientes');
  }

  hasPedidosPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Pedidos"
    return this.hasPermission(role, 'Pedidos');
  }

  hasPedidosEmpleadosPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Orden de producción"
    return this.hasPermission(role, 'Pedidos Empleado');
  }

  hasPedidosClientesPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Orden de producción"
    return this.hasPermission(role, 'Pedidos Cliente');
  }

  hasVentasPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Ventas"
    return this.hasPermission(role, 'Ventas');
  }

  hasOrdenProduccionPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Orden de producción"
    return this.hasPermission(role, 'Orden de produccion');
  }

  hasOrdenProduccionEmpleadoPermission(role: Roles): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso "Orden de producción"
    return this.hasPermission(role, 'Orden de produccion Empleado');
  }

//Categorias Cliente, 

  hasPermission(role: Roles, permissionName: string): boolean {
    // Implementa la lógica para verificar si el rol tiene el permiso necesario
    return role.permisos_rol.some(permission => permission.nombre_permiso === permissionName);
  }
}

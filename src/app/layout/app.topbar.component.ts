import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from 'src/app/demo/components/auth/login/login.services';
import { Router } from '@angular/router'; //Se importa el Router
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    confirmarCerrarSesionDialog = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private loginService: LoginService, private router: Router) { }

    logout(): void {
        this.confirmarCerrarSesionDialog = true; // Redirige al usuario al componente de login
    }

    noCerrarSesion() {
        this.confirmarCerrarSesionDialog = false;
    }

    cerrarSesion() {
        this.confirmarCerrarSesionDialog = false;
        this.loginService.logout(); // Llamar al servicio para cerrar sesión o ejecutar las acciones correspondientes para cerrar la sesión del usuario
        this.router.navigate(['/auth/login']); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
    }

    perfil() {
        this.router.navigate(['/pages/perfil']); // Esta ruta debe coincidir con tu ruta '/perfil' definida en las rutas de tu aplicación
    }

}

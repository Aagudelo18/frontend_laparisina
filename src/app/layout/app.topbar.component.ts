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

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private loginService: LoginService, private router: Router) { }

    logout(): void {
        this.loginService.logout(); // Llama al método logout() del servicio LoginService
        this.router.navigate(['/auth/login']); // Redirige al usuario al componente de login
    }

    perfil() {
        this.router.navigate(['/pages/perfil']); // Esta ruta debe coincidir con tu ruta '/perfil' definida en las rutas de tu aplicación
    }
    
}

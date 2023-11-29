import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Menú',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-users', routerLink: ['/pages/roles'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios'] },
                    { label: 'Categorias', icon: 'pi pi-spin pi-cog', routerLink: ['/pages/categorias'] },
                    { label: 'Productos', icon: 'pi pi-spin pi-cog', routerLink: ['/pages/productos'] },
                    { label: 'Empleados', icon: 'pi pi-fw pi-users', routerLink: ['/pages/empleados'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['/pages/clientes'] },
                    { label: 'Pedidos', icon: 'pi pi-fw pi-user', routerLink: ['/pages/pedidos'] },
                    { label: 'Orden de producción', icon: 'pi pi-spin pi-cog', routerLink: ['/pages/ordenP'] },
                    { label: 'Ventas', icon: 'pi-money-bill', routerLink: ['/pages/ventas'] },
                    

                ]
            },

            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    },
                ]
            },
        ];
    }


}
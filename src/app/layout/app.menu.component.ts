import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    token: any;

    constructor(public layoutService: LayoutService) { }

    

    ngOnInit() {
        this.createMenu();
       
    }

    createMenu(){
        let rol: any = localStorage.getItem('rol');
        

        if (rol == 'Super Admin'){
            this.model = [
                {
                    label: 'Menú',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                        //{ label: 'Perfil', icon: 'pi pi-money-bill', routerLink: ['/pages/perfil'] },
                    ]
                },
                {
                    label: 'Configuración',
                    items: [
                        { label: 'Roles', icon: 'pi pi-fw pi-users', routerLink: ['/pages/roles'] },
                    ]
                },
                {
                    label: 'Usuarios',
                    items: [
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios'] },
                    ]
                },
                {
                    label: 'Producción',
                    items: [
                        { label: 'Categorias', icon: 'pi pi-tag', routerLink: ['/pages/categorias'] },
                        { label: 'Productos', icon: 'pi pi-tags', routerLink: ['/pages/productos'] },
                        { label: 'Orden de producción', icon: 'pi pi-shopping-bag', routerLink: ['/pages/ordenP'] },
                        { label: 'Empleados', icon: 'pi pi-fw pi-users', routerLink: ['/pages/empleados'] },
                    ]
                },
                {
                    label: 'Ventas',
                    items: [
                        { label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['/pages/clientes'] },
                        { label: 'Transportes', icon: 'pi pi-fw pi-truck', routerLink: ['/pages/transportes'] },
                        { label: 'Pedidos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/pedidos'] },
                        { label: 'Ventas', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/ventas'] },
                    ]
                }
    
    
                // {
                //     label: 'Pages',
                //     icon: 'pi pi-fw pi-briefcase',
                //     items: [
                //         {
                //             label: 'Auth',
                //             icon: 'pi pi-fw pi-user',
                //             items: [
                //                 {
                //                     label: 'Login',
                //                     icon: 'pi pi-fw pi-sign-in',
                //                     routerLink: ['/auth/login']
                //                 },
                //                 {
                //                     label: 'Error',
                //                     icon: 'pi pi-fw pi-times-circle',
                //                     routerLink: ['/auth/error']
                //                 },
                //                 {
                //                     label: 'Access Denied',
                //                     icon: 'pi pi-fw pi-lock',
                //                     routerLink: ['/auth/access']
                //                 }
                //             ]
                //         },
                //         {
                //             label: 'Not Found',
                //             icon: 'pi pi-fw pi-exclamation-circle',
                //             routerLink: ['/notfound']
                //         },
                //         {
                //             label: 'Empty',
                //             icon: 'pi pi-fw pi-circle-off',
                //             routerLink: ['/pages/empty']
                //         },
                //     ]
                // },
            ];
            return;
        }
        if (rol == 'Cliente' || rol == undefined){
            let token: any = localStorage.getItem('token');
            this.model = [
                {
                    label: 'Menú',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                        //{ label: 'Perfil', icon: 'pi pi-money-bill', routerLink: ['/pages/perfil'] },
                    ]
                },
          
                {
                    label: 'Pedidos',
                    items: [
                        
                        token !== null ? { label: 'Mis Pedidos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pedidoListar'] } : null,
                        { label: 'Catálogo', icon: 'pi pi-fw pi-money-bill', routerLink: ['/catalogo-cliente'] },
                    ].filter(item => item !== null)
                }
            ];
            return;
        }
    }

}
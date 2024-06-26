import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListEmpleadosComponent } from './demo/components/pages/empleados/list-empleados/list-empleados.component';
import { AuthGuard } from './demo/components/auth/guard/auth.guard';

const routes: Routes = [
    // Otras rutas...
    {
        path: 'detalle-empleado/:id',
        component: ListEmpleadosComponent,
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/inicio/inicio.module'
                                ).then((m) => m.InicioModule),
                        },
                        {
                            path: 'dashboard',
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule), canActivate: [AuthGuard], data: { moduleName: 'Dashboard'}
                        },
                        {
                            path: 'uikit',
                            loadChildren: () =>
                                import(
                                    './demo/components/uikit/uikit.module'
                                ).then((m) => m.UIkitModule),
                        },
                        {
                            path: 'pages',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                        {
                            path: 'new-pedidos',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedidos/new-pedidos/new-pedidos.module'
                                ).then((m) => m.NewPedidosModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos' }
                        },
                        {
                            path: 'list-pedidos',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedidos/list-pedidos/list-pedidos.module'
                                ).then((m) => m.ListPedidosModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos' }
                        },
                        {
                            path: 'new-empleados',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/empleados/new-empleados/new-empleados.module'
                                ).then((m) => m.NewEmpleadosModule), canActivate: [AuthGuard], data: { moduleName: 'Empleados' }
                        },
                        {
                            path: 'list-empleados',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/empleados/list-empleados/list-empleados.module'
                                ).then((m) => m.ListEmpleadosModule), canActivate: [AuthGuard], data: { moduleName: 'Empleados' }
                        },
                        {
                            path: 'catalogo-cliente',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/product-list/product-list.module'
                                ).then((m) => m.ProductModule),
                        },
                        {
                            path: 'pedidoCliente',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedido-cliente/pedido-cliente.module'
                                ).then((m) => m.PedidoClienteModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos Cliente' }
                        },
                        {
                            path: 'pedidoListar',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedido-list/pedido-list.module'
                                ).then((m) => m.PedidoListModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos Cliente' }
                        },
                    ],
                },      
               
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./demo/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

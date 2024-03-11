import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListEmpleadosComponent } from './demo/components/pages/empleados/list-empleados/list-empleados.component';

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
                            path: 'clientes',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/clientes/clientes.module'
                                ).then((m) => m.ClientesModule),
                        },
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'uikit',
                            loadChildren: () =>
                                import(
                                    './demo/components/uikit/uikit.module'
                                ).then((m) => m.UIkitModule),
                        },
                        {
                            path: 'utilities',
                            loadChildren: () =>
                                import(
                                    './demo/components/utilities/utilities.module'
                                ).then((m) => m.UtilitiesModule),
                        },
                        {
                            path: 'documentation',
                            loadChildren: () =>
                                import(
                                    './demo/components/documentation/documentation.module'
                                ).then((m) => m.DocumentationModule),
                        },
                        {
                            path: 'blocks',
                            loadChildren: () =>
                                import(
                                    './demo/components/primeblocks/primeblocks.module'
                                ).then((m) => m.PrimeBlocksModule),
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
                                ).then((m) => m.NewPedidosModule),
                        },
                        {
                            path: 'list-pedidos',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedidos/list-pedidos/list-pedidos.module'
                                ).then((m) => m.ListPedidosModule),
                        },
                        {
                            path: 'new-empleados',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/empleados/new-empleados/new-empleados.module'
                                ).then((m) => m.NewEmpleadosModule),
                        },
                        {
                            path: 'list-empleados',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/empleados/list-empleados/list-empleados.module'
                                ).then((m) => m.ListEmpleadosModule),
                        },
                        {
                            path: 'vistaCliente',
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
                                ).then((m) => m.PedidoClienteModule),
                        },
                        {
                            path: 'pedidoListar',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pedido-list/pedido-list.module'
                                ).then((m) => m.PedidoListModule),
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
                {
                    path: 'landing',
                    loadChildren: () =>
                        import('./demo/components/landing/landing.module').then(
                            (m) => m.LandingModule
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

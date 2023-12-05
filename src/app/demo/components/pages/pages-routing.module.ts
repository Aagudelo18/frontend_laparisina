import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/demo/components/auth/guard/login.guard'; // Importa tu guard de autenticación

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule), canActivate: [AuthGuard] },
        { path: 'ordenP', loadChildren: () => import('./ordenP/ordenP.module').then(m => m.OrdenDeProduccionModule), canActivate: [AuthGuard] },
        {
            path: 'usuarios',
            loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
            canActivate: [AuthGuard] // Aplica el guard a la ruta que necesita protección
        },
        
        { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule), canActivate: [AuthGuard] },
        { path: 'categorias', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule), canActivate: [AuthGuard] },
        { path: 'vistaC', loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductModule), canActivate: [AuthGuard] },
        { path: 'productos', loadChildren: () => import('./productos/producto.module').then(m => m.ProductoModule), canActivate: [AuthGuard] },
        { path: 'pedidos', loadChildren: () => import('./pedidos/list-pedidos/list-pedidos.module').then(m => m.ListPedidosModule), canActivate: [AuthGuard] },
        { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule), canActivate: [AuthGuard] },
        { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule), canActivate: [AuthGuard] },
        { path: 'new-pedidos', loadChildren: () => import('./pedidos/new-pedidos/new-pedidos.module').then(m => m.NewPedidosModule), canActivate: [AuthGuard] },
        { path: 'empleados', loadChildren: () => import('./empleados/list-empleados/list-empleados.module').then(m => m.ListEmpleadosModule)},
        { path: 'new-empleados', loadChildren: () => import('./empleados/new-empleados/new-empleados.module').then(m => m.NewEmpleadosModule)},
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule), canActivate: [AuthGuard] },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule), canActivate: [AuthGuard] },
        //{ path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule), canActivate: [AuthGuard] },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'ordenP', loadChildren: () => import('./ordenP/ordenP.module').then(m => m.OrdenDeProduccionModule)},

      

        { path: '**', redirectTo: '/notfound' }

    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

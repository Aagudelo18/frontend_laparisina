import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/demo/components/auth/guard/auth.guard'; // Importa tu guard de autenticación

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule), canActivate: [AuthGuard], data: { moduleName: 'Roles' } },
        { path: 'ordenP', loadChildren: () => import('./ordenP/ordenP.module').then(m => m.OrdenDeProduccionModule), canActivate: [AuthGuard], data: { moduleName: 'Orden de produccion' } },
        {
            path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate: [AuthGuard], data: { moduleName: 'Usuarios' } // Aquí especificamos el nombre del módulo
        },

        { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule), canActivate: [AuthGuard], data: { moduleName: 'Clientes' } },
        { path: 'clientes', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
        { path: 'transportes', loadChildren: () => import('./transportes/transportes.module').then(m => m.TransportesModule), canActivate: [AuthGuard], data: { moduleName: 'Transportes' } },
        { path: 'categorias', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule), canActivate: [AuthGuard], data: { moduleName: 'Categorias' } },
        { path: 'vistaC', loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductModule), canActivate: [AuthGuard], data: { moduleName: 'Productos' } },
        { path: 'productos', loadChildren: () => import('./productos/producto.module').then(m => m.ProductoModule), canActivate: [AuthGuard], data: { moduleName: 'Productos' } },
        { path: 'pedidos', loadChildren: () => import('./pedidos/list-pedidos/list-pedidos.module').then(m => m.ListPedidosModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos' } },
        { path: 'pedido-cliente', loadChildren: () => import('./pedido-cliente/pedido-cliente.module').then(m => m.PedidoClienteModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos' } },
        { path: 'pedido-list', loadChildren: () => import('./pedido-list/pedido-list.module').then(m => m.PedidoListModule), canActivate: [AuthGuard], data: { moduleName: 'Pedidos' } },
        { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule), canActivate: [AuthGuard], data: { moduleName: 'Ventas' } },
        { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule), canActivate: [AuthGuard], data: { moduleName: 'Clientes' }  },
        { path: 'new-pedidos', loadChildren: () => import('./pedidos/new-pedidos/new-pedidos.module').then(m => m.NewPedidosModule), canActivate: [AuthGuard] },
        { path: 'empleados', loadChildren: () => import('./empleados/list-empleados/list-empleados.module').then(m => m.ListEmpleadosModule), canActivate: [AuthGuard], data: { moduleName: 'Empleados' } },
        { path: 'new-empleados', loadChildren: () => import('./empleados/new-empleados/new-empleados.module').then(m => m.NewEmpleadosModule), canActivate: [AuthGuard], data: { moduleName: 'Empleados' } },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule), canActivate: [AuthGuard] },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule), canActivate: [AuthGuard] },
        //{ path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule), canActivate: [AuthGuard] },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },



        { path: '**', redirectTo: '/notfound' }

    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

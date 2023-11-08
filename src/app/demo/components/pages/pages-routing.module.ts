import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)},
        { path: 'pedidos', loadChildren: () => import('./pedidos/list-pedidos/list-pedidos.module').then(m => m.ListPedidosModule)},
        //{ path: 'new-pedidos', loadChildren: () => import('./pedidos/new-pedidos/new-pedidos.module').then(m => m.NewPedidosModule)},
        { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)},
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

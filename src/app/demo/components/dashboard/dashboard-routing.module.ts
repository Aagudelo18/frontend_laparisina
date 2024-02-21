import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/demo/components/auth/login/login.guard'; // Importa tu guard de autenticación

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent, canActivate: [AuthGuard] }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

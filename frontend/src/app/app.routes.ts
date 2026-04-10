import { Routes } from '@angular/router';
import { NoAutorizadoComponent } from './pages/no-autorizado/no-autorizado';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/login/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DashboardVendedorComponent } from './pages/dashboardVendedor/dashboardVendedor';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboardvendedor', component: DashboardVendedorComponent },
  { path: '**', redirectTo: 'login' },
  {path: 'no-autorizado',component: NoAutorizadoComponent}
];
import { Routes } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { VentasComponent } from './pages/ventas/ventas.component';

export const routes: Routes = [
    { path: '', component: UsuariosComponent }, // 👈 ruta principal
    { path: 'Usuarios', component: UsuariosComponent },
    { path: 'Productos', component: ProductosComponent},
    { path: 'Compras', component: ComprasComponent},
    { path: 'Ventas', component: VentasComponent},
];
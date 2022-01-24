import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HomeComponent } from './pages/home/home.component';
import { MispedidosComponent } from './pages/mispedidos/mispedidos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  {    path: 'home',component: HomeComponent},
  {    path: 'set-productos',component: SetProductosComponent},
  {    path: 'carrito',component: CarritoComponent},
  {    path: 'perfil',component: PerfilComponent},
  {    path: 'mis-pedidos',component: MispedidosComponent},
  {  path: '',component: HomeComponent  },
  {  path: '**', redirectTo: 'home',  pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

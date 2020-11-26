import { AclGuard } from './guards/acl.guard';

import { MaquinaComponent } from './components/maquina/maquina.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchClientComponent } from './components/search-client/search-client.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ClientComponent } from './components/client/client.component';
import { AsignarTurnoComponent } from './components/asignar-turno/asignar-turno.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaquinaListadoComponent } from './components/maquina-listado/maquina-listado.component';
import { ClienteComponent } from './components/nuevo-cliente/cliente.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { EmpleadoListadoComponent } from './components/empleado-listado/empleado-listado.component';
import { InsumoListadoComponent } from './components/insumo-listado/insumo-listado.component';
import { InsumoComponent } from './components/insumo/insumo.component';
import { ServicioListadoComponent } from './components/servicio-listado/servicio-listado.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { UsuarioListadoComponent } from './components/usuario-listado/usuario-listado.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InformesListadoComponent } from './components/informes-listado/informes-listado.component';
import { InformeTurnosServiciosComponent } from './components/informe-turnos-servicios/informe-turnos-servicios.component';
import { InformeUsoMaquinasComponent } from './components/informe-uso-maquinas/informe-uso-maquinas.component';
import { ConfiguracionesListadoComponent } from './components/configuraciones-listado/configuraciones-listado.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { FeriadosListadoComponent } from './components/feriados-listado/feriados-listado.component';
import { FeriadoComponent } from './components/feriado/feriado.component';
import { TurnosListadoComponent } from './components/turnos-listado/turnos-listado.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'solarium',
    component: NavbarComponent,
    children: [
      { path: 'search-client', component: SearchClientComponent },
      { path: 'client/:id', component: ClientComponent },
      { path: 'asignar-turno/:id', component: AsignarTurnoComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'maquinas', component: MaquinaListadoComponent },
      { path: 'maquina', component: MaquinaComponent },
      { path: 'maquina/:id', component: MaquinaComponent },
      { path: 'cliente', component: ClienteComponent },
      { path: 'cliente/:id', component: ClienteComponent },
      { path: 'empleados', component: EmpleadoListadoComponent, data: { name: 'empleados' }, canActivate: [AclGuard] },
      { path: 'empleado', component: EmpleadoComponent, data: { name: 'empleados' }, canActivate: [AclGuard] },
      { path: 'empleado/:id', component: EmpleadoComponent, data: { name: 'empleados' }, canActivate: [AclGuard] },
      { path: 'insumos', component: InsumoListadoComponent },
      { path: 'insumo', component: InsumoComponent },
      { path: 'insumo/:id', component: InsumoComponent },
      { path: 'servicios', component: ServicioListadoComponent },
      { path: 'servicio', component: ServicioComponent },
      { path: 'servicio/:id', component: ServicioComponent },
      { path: 'usuarios', component: UsuarioListadoComponent, data: { name: 'usuarios' }, canActivate: [AclGuard] },
      { path: 'usuario', component: UsuarioComponent, data: { name: 'usuarios' }, canActivate: [AclGuard] },
      { path: 'usuario/:id', component: UsuarioComponent, data: { name: 'usuarios' }, canActivate: [AclGuard] },
      { path: 'informes', component: InformesListadoComponent, data: { name: 'informes' }, canActivate: [AclGuard] },
      {
        path: 'informe-turnos-servicios',
        component: InformeTurnosServiciosComponent,
        data: { name: 'informes' },
        canActivate: [AclGuard]
      },
      {
        path: 'informe-uso-maquinas',
        component: InformeUsoMaquinasComponent,
        data: { name: 'informes' },
        canActivate: [AclGuard]
      },
      { path: 'configuraciones', component: ConfiguracionesListadoComponent, data: { name: 'configuraciones' }, canActivate: [AclGuard] },
      { path: 'horarios', component: HorariosComponent, data: { name: 'configuraciones' }, canActivate: [AclGuard] },
      { path: 'feriados', component: FeriadosListadoComponent, data: { name: 'feriados' }, canActivate: [AclGuard] },
      { path: 'feriado', component: FeriadoComponent, data: { name: 'feriados' }, canActivate: [AclGuard] },
      { path: 'feriado/:id', component: FeriadoComponent, data: { name: 'feriados' }, canActivate: [AclGuard] },
      { path: 'turnos/:id', component: TurnosListadoComponent },
      { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
    ]
  },
  { path: '**', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

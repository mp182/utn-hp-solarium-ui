import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr);

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@angular/cdk/layout';
import { NavbarComponent } from './components/navbar/navbar.component';

import { SearchClientComponent } from './components/search-client/search-client.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientComponent } from './components/client/client.component';
import { AsignarTurnoComponent } from './components/asignar-turno/asignar-turno.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EventPopupComponent } from './components/event-popup/event-popup.component';
import { MensajePopupComponent } from './components/mensaje-popup/mensaje-popup.component';
import { AppMaterialModule } from './app-material.module';
import { LoginComponent } from './components/login/login.component';
import { BaseABMComponent } from './base-abm/base-abm.component';
import { MaquinaComponent } from './components/maquina/maquina.component';
import { MaquinaListadoComponent } from './components/maquina-listado/maquina-listado.component';
import { ClienteComponent } from './components/nuevo-cliente/cliente.component';
import { AuthInterceptor } from './auth.interceptor';
import { LoaderInterceptor } from './loader.interceptor';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { EmpleadoListadoComponent } from './components/empleado-listado/empleado-listado.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InsumoListadoComponent } from './components/insumo-listado/insumo-listado.component';
import { InsumoComponent } from './components/insumo/insumo.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { ServicioListadoComponent } from './components/servicio-listado/servicio-listado.component';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { UsuarioListadoComponent } from './components/usuario-listado/usuario-listado.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InformeTurnosServiciosComponent } from './components/informe-turnos-servicios/informe-turnos-servicios.component';
import { ChartsModule } from 'ng2-charts';
import { InformesListadoComponent } from './components/informes-listado/informes-listado.component';
import { InformeUsoMaquinasComponent } from './components/informe-uso-maquinas/informe-uso-maquinas.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { ConfiguracionesListadoComponent } from './components/configuraciones-listado/configuraciones-listado.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { FeriadosListadoComponent } from './components/feriados-listado/feriados-listado.component';
import { FeriadoComponent } from './components/feriado/feriado.component';
import { TurnosListadoComponent } from './components/turnos-listado/turnos-listado.component';
import { HorarioService } from './services/horario.service';
import { UsuarioService } from './services/usuario.service';

export function initializeApp(
  horarios: HorarioService,
  usuarioService: UsuarioService
) {
  return () => {
    horarios.loadData();
    usuarioService.validarToken();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchClientComponent,
    PageNotFoundComponent,
    ClientComponent,
    AsignarTurnoComponent,
    CalendarioComponent,
    EventPopupComponent,
    MensajePopupComponent,
    LoginComponent,
    BaseABMComponent,
    MaquinaComponent,
    MaquinaListadoComponent,
    ClienteComponent,
    EmpleadoComponent,
    EmpleadoListadoComponent,
    InsumoListadoComponent,
    InsumoComponent,
    ServicioComponent,
    ServicioListadoComponent,
    HasPermissionDirective,
    UsuarioListadoComponent,
    UsuarioComponent,
    InformeTurnosServiciosComponent,
    InformesListadoComponent,
    InformeUsoMaquinasComponent,
    LoaderComponent,
    ChangePasswordDialogComponent,
    ConfiguracionesListadoComponent,
    HorariosComponent,
    FeriadosListadoComponent,
    FeriadoComponent,
    TurnosListadoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    FullCalendarModule,
    AppMaterialModule,
    ChartsModule,
    NgxMaterialTimepickerModule.setLocale('es-AR')
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [HorarioService, UsuarioService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BaseABMService } from './base-abm.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Usuario } from '../Models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseABMService {

  public endpoint = 'usuarios';
  private usuario: Usuario;
  public usuarioReplaySubject: ReplaySubject<Usuario>;

  constructor(
    public apiService: ApiService,
    public notification: NotificationService,
    public router: Router
  ) {
    super();
    this.usuarioReplaySubject = new ReplaySubject<Usuario>();
  }

  setUsuario(usuario: Usuario) {
    this.usuario = usuario;
    this.usuarioReplaySubject.next(this.usuario);
  }

  getUsuario(): Observable<Usuario> {
    return this.usuarioReplaySubject;
  }

  misDatos(): Observable<any> {
    return this.apiService.get<any>('me');
  }

  validarToken() {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      this.misDatos().subscribe(
        usuario => {
          if (usuario) {
            this.setUsuario(usuario.user);
          } else {
            this.router.navigateByUrl('login');
          }
        }
      );
    } else {
      this.router.navigateByUrl('login');
    }
  }

  resetUser() {
    localStorage.clear();
    this.usuarioReplaySubject.complete();
    this.usuario = null;
    this.usuarioReplaySubject = new ReplaySubject<Usuario>();
  }

}

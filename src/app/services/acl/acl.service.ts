import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ACL } from './acl';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AclService {

  constructor(
    private usuarioService: UsuarioService
  ) { }

  can(permission: string): Observable<boolean> {
    return this.usuarioService.getUsuario().pipe(
      map(
        usuario => {
          const usuarioActual = usuario;
          const roles = ACL[permission];
          if (!roles) {
            return false;
          }
          if (roles.indexOf('*') >= 0) {
            return true;
          }
          return roles?.includes(usuarioActual?.rol?.nombre);
        }
      ));
  }
}

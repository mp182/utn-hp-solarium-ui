import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AclService } from '../services/acl/acl.service';
import { UsuarioService } from '../services/usuario.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private aclService: AclService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return combineLatest([this.usuarioService.getUsuario(), this.aclService.can(next.data.name)])
      .pipe(map(
        result => {
          const currentUser = result[0];
          const routeName = next.data.name;
          if (!currentUser.rol || routeName.length === 0 || !result[1]) {
            // If not logged, redirect to login with current url.
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
          return true;
        }
      ));
  }
}

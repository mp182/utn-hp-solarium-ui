import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/Models/usuario.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: Usuario;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuario().subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  cerrarSesion() {
    this.usuarioService.resetUser();
    this.router.navigateByUrl('login');
  }

  cambiarPassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '300px',
      data: { usuario: this.usuario }
    });

    dialogRef.afterClosed().subscribe((usuario: Usuario) => {
      this.usuarioService.update(usuario.id, usuario).subscribe();
    });
  }

}

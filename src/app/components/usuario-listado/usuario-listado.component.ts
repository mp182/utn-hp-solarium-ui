import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/Models/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-usuario-listado',
  templateUrl: './usuario-listado.component.html',
  styleUrls: ['./usuario-listado.component.css']
})
export class UsuarioListadoComponent implements OnInit {

  usuarios$: Observable<Usuario[]>;
  columnsToDisplay = ['usuario', 'acciones'];
  usuario: Observable<Usuario>;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarios$ = this.usuarioService.getAll().pipe(
      tap(usuarios => {
        usuarios.sort((a, b) => a.usuario < b.usuario ? -1 : 1);
      })
    );

    this.usuario = this.usuarioService.getUsuario();
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el usuario?')) {
      this.usuarioService.delete(id).subscribe();
    }
  }

}

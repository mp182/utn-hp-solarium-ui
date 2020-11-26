import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { Observable, Subscription } from 'rxjs';
import { Rol } from 'src/app/Models/rol.interface';
import { Empleado } from 'src/app/Models/empleado.interface';
import { Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { Usuario } from 'src/app/Models/usuario.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent extends BaseABMComponent implements OnInit, OnDestroy {

  roles: Rol[] = [
    { id: 1, nombre: 'Dueño' },
    { id: 2, nombre: 'Encargado' }
  ];

  empleados$: Observable<Empleado[]>;
  usuariosSubcription: Subscription;

  form = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
    id_rol: [null, Validators.required],
    id_personal: [null]
  });

  redirectRoute = '/solarium/usuarios';

  constructor(
    public service: UsuarioService,
    public empleadoService: EmpleadoService,
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    super(service);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.empleados$ = this.empleadoService.getAll().pipe(
      tap((empleados: Empleado[]) => {
        if (empleados) {
          empleados.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.usuariosSubcription) { this.usuariosSubcription.unsubscribe(); }
  }

  loadData() {
    if (this.accion === 'editar') {
      this.form.get('password').setValidators([]);
    }
    super.loadData();
  }

  comprobarUsuario(usuario: string) {
    if (usuario !== this.item.usuario) {
      this.usuariosSubcription = this.service.getAll()
        .subscribe((usuarios: Usuario[]) => {
          if (usuarios.length > 0 && usuarios.some(x => x.usuario === usuario)) {
            this.form.controls.usuario.setErrors({ usuario_existe: true });
          }
        }, (error) => {
          this.notificationService.error(error);
        });
    }
  }

}

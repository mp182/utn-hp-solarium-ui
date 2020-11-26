import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginSubscription: Subscription;

  loginForm = this.formBuilder.group({
    user: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() { }

  onSubmit() {
    this.usuarioService.resetUser();
    this.authService.login(this.loginForm.value.user, this.loginForm.value.password)
      .pipe(
        switchMap(loginResponse => {
          if (loginResponse) {
            localStorage.setItem('access_token', loginResponse.access_token);
            return this.usuarioService.misDatos();
          } else {
            this.notificationService.error('Usuario y/o contraseña incorrectos.');
            return EMPTY;
          }
        })
      )
      .subscribe((usuario) => {
        if (usuario) {
          this.usuarioService.setUsuario(usuario.user);
          this.router.navigateByUrl('solarium/search-client');
        } else {
          this.notificationService.error('Usuario y/o contraseña incorrectos.');
        }
      }, () => {
        this.notificationService.error('Usuario y/o contraseña incorrectos.');
      });
  }

}

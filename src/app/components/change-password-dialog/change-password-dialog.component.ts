import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from 'src/app/Models/usuario.interface';
import { ConfirmedValidator } from './confirmed-validator';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validator: ConfirmedValidator('newPassword', 'confirm_password')
    });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) { }

  update() {
    const usuario = { ...this.data.usuario, password: this.form.controls.newPassword.value };
    this.dialogRef.close(usuario);
  }

}

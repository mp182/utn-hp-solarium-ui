import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Servicio } from '../../Models/servicio.interface';
import { Cliente } from 'src/app/Models/cliente.interface';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css']
})
export class EventPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      event: string,
      cliente: Cliente,
      servicio: Servicio,
      concretado: null | boolean,
      soloVerDatos: null | boolean
    }
  ) { }

  guardar() {
    this.dialogRef.close({ guardar: true });
  }

  eliminar() {
    this.dialogRef.close({ eliminar: true });
  }

  validar() {
    this.dialogRef.close({ validar: true });
  }

}

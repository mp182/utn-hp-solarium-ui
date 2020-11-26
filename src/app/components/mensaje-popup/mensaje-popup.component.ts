import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-popup',
  templateUrl: './mensaje-popup.component.html',
  styleUrls: ['./mensaje-popup.component.css']
})
export class MensajePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MensajePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string, mensaje: string, }
  ) { }

  ngOnInit(): void {
  }

}

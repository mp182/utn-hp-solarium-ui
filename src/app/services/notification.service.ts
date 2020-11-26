import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  public error(message: string) {
    this.snackBar.open(message, '❌', { duration: 3000, });
  }

  public message(message: string) {
    this.snackBar.open(message, '✅', { duration: 3000, });
  }
}

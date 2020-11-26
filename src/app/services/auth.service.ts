import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient
  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Algo salió mal! Por favor intente de nuevo más tarde.');
  }

  login(username: string, password: string) {
    const url = 'https://hp.ioagenciadigital.com/oauth/token';
    const body = {
      grant_type: 'password',
      client_id: 3,
      client_secret: 'A3BheJVegkiX0ZZiWGlZqG8WONfkzQ32Srkh6Knm',
      username,
      password
    };
    return this.http.post<any>(url, body, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
}

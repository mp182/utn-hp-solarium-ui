import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

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

  private generateParams(data: object): HttpParams {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.set(key, data[key]);
      }
    }
    return params;
  }

  public get<T>(endpoint, params?: object) {
    const url = environment.apiUrl + endpoint;
    const options = params ? { params: this.generateParams(params) } : {};

    return this.http.get<T>(url, options).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  public post<T>(endpoint, body) {
    const url = environment.apiUrl + endpoint;
    return this.http.post<T>(url, body, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  public put<T>(endpoint, body) {
    const url = environment.apiUrl + endpoint;
    return this.http.put<T>(url, body, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  public delete<T>(endpoint: string) {
    const url = environment.apiUrl + endpoint;
    return this.http.delete<T>(url, httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

}

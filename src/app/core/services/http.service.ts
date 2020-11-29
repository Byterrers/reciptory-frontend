import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  defaultUrl: string;

  constructor(private http: HttpClient) {
    this.defaultUrl = 'http://localhost:3000/api';
  }

  get(url: string, params: string = ''): Observable<any> {
    return this.http.get(`${this.defaultUrl}${url}${params}`);
  }

  post(url: string, params: any): Observable<any> {
    return this.http.post(this.defaultUrl + url, params);
  }

  put(url: string, params: any): Observable<any> {
    return this.http.put(this.defaultUrl + url, params);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.defaultUrl + url);
  }

  private handleError(error: any, textStatus?: any) {
    let errMsg = 'Server error';
    if (error.status === 0) {
      errMsg = 'No está conectado, verifique la red.';
    } else if (error.status === 401) {
      errMsg = 'La sesión caducó';
    } else if (error.status === 403) {
      errMsg = 'Acceso prohibido';
    } else if (error.status === 404) {
      errMsg = 'Recurso no encontrado.';
    } else if (error.status === 500) {
      errMsg = 'Internal Server Error [500].';
    } else if (textStatus === 'parsererror') {
      errMsg = 'Requested JSON parse failed.';
    } else if (textStatus === 'timeout') {
      errMsg = 'Time out.';
    } else {
      errMsg = 'No está conectado, verifique la red.';
    }

    return throwError(errMsg);
  }
}

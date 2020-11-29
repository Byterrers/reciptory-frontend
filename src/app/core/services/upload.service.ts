import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  url = 'http://localhost:3000/api';
  httpOptions;

  private httpClient: HttpClient;

  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  uploadRecipic(recipic: FormData): Observable<any> {
    return this.httpClient.post(`${this.url}/utils/upload/recipe`, recipic, {
      headers: new HttpHeaders()
    });
  }

  uploadAvatar(avatar: FormData): Observable<any> {
    return this.httpClient.post(`${this.url}/utils/upload/avatar`, avatar, {
      headers: new HttpHeaders()
    });
  }
}

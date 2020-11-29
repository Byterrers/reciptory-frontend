import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  constructor(
    public httpService: HttpService
  ) {}

  scan(data: any): Observable<any> {
    return this.httpService.post('/scanner', data);
  }
}

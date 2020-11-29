import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Entities.
import { RegisterDto } from '../entities/dtos/register.dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(
    public httpService: HttpService
  ) {}

  register(user: RegisterDto): Observable<any> {
    return this.httpService.post('/register', user);
  }
}

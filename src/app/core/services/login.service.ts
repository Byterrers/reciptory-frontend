import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Services.
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

// Entities.
import { LoginDto } from '../entities/dtos/login.dto';
import { Login } from '../entities/login.class';
import { User } from '../entities/user.class';
import { UserInfo } from '../entities/user-info.class';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user: User;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.loadStorage();
  }

  login(user: LoginDto): Observable<any> {
    return this.httpService.post('/login', user);
  }

  logout() {
    this.clearStorage();
    this.authService.clear();
    this.router.navigate(['/welcome']);
  }

  loadStorage() {
    if (this.authService.token) {
      this.user = this.storageService.getUser();
    } else {
      this.user = null;
    }
  }

  saveStorage(token: string, user: User) {
    this.storageService.setToken(token);
    this.storageService.setUser(user);

    this.authService.token = token;

    this.user = user;
  }

  saveInfoStorage(userInfo: UserInfo) {
    this.storageService.setUserInfo(userInfo);
  }

  clearStorage() {
    this.user = null;

    this.storageService.setUser(null);
    this.storageService.setUserInfo(null);

    this.authService.clear();
  }
}

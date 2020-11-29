import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _token: string;
  private TOKEN_STORAGE = 'token';

  constructor() {
    this._token = null;
  }

  get token() {
    return this._token || localStorage.getItem(this.TOKEN_STORAGE);
  }

  set token(token) {
    this._token = token;
    localStorage.setItem(this.TOKEN_STORAGE, token);
  }

  isLogged(): boolean {
    return this.token != null && this.token.length > 5;
  }

  clear() {
    this._token = null;
    localStorage.removeItem(this.TOKEN_STORAGE);
  }
}

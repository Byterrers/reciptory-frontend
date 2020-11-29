import { Injectable } from '@angular/core';

// Services.
import { User } from '../entities/user.class';
import { UserInfo } from '../entities/user-info.class';

// Entities.

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  USER_STORAGE = 'user';
  USERINFO_STORAGE = 'user-info';
  accessToken: string;

  constructor() {}

  getUser(): User {
    return JSON.parse(localStorage.getItem(`${this.USER_STORAGE}`));
  }

  setUser(user: User) {
    if (user != null) {
      localStorage.setItem(`${this.USER_STORAGE}`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${this.USER_STORAGE}`);
    }
  }

  getUserInfo(): UserInfo {
    return JSON.parse(localStorage.getItem(`${this.USERINFO_STORAGE}`));
  }

  setUserInfo(userInfo: UserInfo) {
      if (userInfo != null) {
          localStorage.setItem(
            `${this.USERINFO_STORAGE}`,
            JSON.stringify(userInfo)
          );
      } else {
          localStorage.removeItem(
            `${this.USERINFO_STORAGE}`
          );
      }
  }

  getToken(): string {
    return this.accessToken;
  }

  setToken(accesToken: string) {
    this.accessToken = accesToken;
  }

  // Search filters.

  getByInventory() {
    return JSON.parse(localStorage.getItem('byInventory'));
  }

  setByInventory(value: boolean) {
    localStorage.setItem('byInventory', JSON.stringify(value));
  }

  getByPreferences() {
    return JSON.parse(localStorage.getItem('byPreferences'));
  }

  setByPreferences(value: boolean) {
    localStorage.setItem('byPreferences', JSON.stringify(value));
  }

  getByAllergies() {
    return JSON.parse(localStorage.getItem('byAllergies'));
  }

  setByAllergies(value: boolean) {
    localStorage.setItem('byAllergies', JSON.stringify(value));
  }
}

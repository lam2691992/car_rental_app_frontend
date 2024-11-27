import { Injectable } from '@angular/core';

const TOKEN = 'token';
const USER = 'user';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  static saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user == null) { return '';}
    return user.id;
  }

  static getToken() {
    return window.localStorage.getItem(TOKEN);
  }

  static getUser() {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  static getUserRole(): number {
    const user = this.getUser();
    return user ? user.role : -1;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() == null) return false;
    const role: number = this.getUserRole();
    return role === 0;
  }

  static isCustomerLoggedIn(): boolean {
    if (this.getToken() == null) return false;
    const role: number = this.getUserRole();
    return role === 1;
  }

  static logout(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
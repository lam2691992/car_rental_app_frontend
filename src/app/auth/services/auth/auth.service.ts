import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

const BASE_URL = ["http://localhost:8080"];
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
 

  constructor(private http: HttpClient) {}
  register(signupRequest: any):Observable<any> {
    return this.http.post(BASE_URL + "/api/auth/signup", signupRequest);
  }
  login(loginRequest: any):Observable<any> {
    return this.http.post(BASE_URL + "/api/auth/login", loginRequest);
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    // Tạo HttpParams
    const params = new HttpParams().set('email', email);
    // Thực hiện GET request
    return this.http.get<{ exists: boolean }>(BASE_URL + `/api/auth/check-email-exists`, { params });
  }
}

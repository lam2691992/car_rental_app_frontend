import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  [x: string]: any;
  BASIC_URL: any;

  constructor(private http: HttpClient) {}

  processCarImage(car: { imageFormat: string; returnedImage: string }): string {
    let mimeType = '';
    switch (car.imageFormat) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      default:
        mimeType = 'image/png'; // Mặc định nếu không nhận diện được định dạng
    }
    return `data:${mimeType};base64,${car.returnedImage}`;
  }

  getAllCars(): Observable<any> {
    return this.http.get(BASIC_URL + '/api/customer/cars', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCarById(carId: number): Observable<any> {
    return this.http.get(BASIC_URL + '/api/customer/car/' + carId, {
      headers: this.createAuthorizationHeader(),
    });
  }

  bookACar(bookACarDto: any): Observable<any> {
    const headers = this.createAuthorizationHeader().set(
      'Content-Type',
      'application/json'
    );
    return this.http.post(`${BASIC_URL}/api/customer/car/book`, bookACarDto, {
      headers,
    });
  }

  getBookingsByUserId(): Observable<any> {
    return this.http.get(
      BASIC_URL + '/api/customer/car/bookings/' + StorageService.getUserId(),
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  searchCar(searchCarDto: any): Observable<any> {
    return this.http.post(
      BASIC_URL + '/api/customer/car/search',
      searchCarDto,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  // Lấy danh sách các thương hiệu xe (brands)
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${BASIC_URL}/api/customer/cars/brands`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // Lấy danh sách các loại xe (types)
  getTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${BASIC_URL}/api/customer/cars/types`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // Lấy danh sách các màu xe (colors)
  getColors(): Observable<string[]> {
    return this.http.get<string[]>(`${BASIC_URL}/api/customer/cars/colors`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // Lấy danh sách các loại hộp số (transmissions)
  getTransmissions(): Observable<string[]> {
    return this.http.get<string[]>(`${BASIC_URL}/api/customer/cars/transmissions`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders = new HttpHeaders();
    const token = StorageService.getToken();

    if (token) {
      console.log('Token:', token); // Kiểm tra token có hợp lệ không
      return authHeaders.set('Authorization', 'Bearer ' + token);
    } else {
      console.error('No token found!');
      return authHeaders; // Nếu không có token, không thêm header Authorization
    }
  }
}

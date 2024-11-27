import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:8080'; 
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  [x: string]: any;
  constructor(private http: HttpClient) {}

  postCar(carDto: any): Observable<any> {
    return this.http.post(BASIC_URL + '/api/admin/car', carDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllCars(): Observable<any> {
    return this.http.get(BASIC_URL + '/api/admin/cars', {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + '/api/admin/car/' + id, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCarById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + '/api/admin/car/' + id, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateCar(carId: number, carDto: any): Observable<any> {
    return this.http.put(BASIC_URL + '/api/admin/car/' + carId, carDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCarBookings(): Observable<any> {
    return this.http.get(BASIC_URL + '/api/admin/car/bookings', {
      headers: this.createAuthorizationHeader(),
    });
  }

  changeBookingStatus(bookingId: number, status: number): Observable<any> {
    return this.http.get(
        BASIC_URL + `/api/admin/car/booking/${bookingId}/${status.toString()}`,
        {
            headers: this.createAuthorizationHeader(),
        }
    );
}

searchCar(searchCarDto: any): Observable<any> {
  return this.http.post(BASIC_URL + '/api/admin/car/search', searchCarDto, {
    headers: this.createAuthorizationHeader(),
  });
}

// Lấy danh sách các thương hiệu xe (brands)
getBrands(): Observable<string[]> {
  return this.http.get<string[]>(`${BASIC_URL}/api/admin/cars/brands`, {
    headers: this.createAuthorizationHeader(),
  });
}

// Lấy danh sách các loại xe (types)
getTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${BASIC_URL}/api/admin/cars/types`, {
    headers: this.createAuthorizationHeader(),
  });
}

// Lấy danh sách các màu xe (colors)
getColors(): Observable<string[]> {
  return this.http.get<string[]>(`${BASIC_URL}/api/admin/cars/colors`, {
    headers: this.createAuthorizationHeader(),
  });
}

// Lấy danh sách các loại hộp số (transmissions)
getTransmissions(): Observable<string[]> {
  return this.http.get<string[]>(`${BASIC_URL}/api/admin/cars/transmissions`, {
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

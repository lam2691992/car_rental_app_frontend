import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
})
export class CustomerDashboardComponent {

  cars: any = [];
  validateForm: any;
  isSpinning: boolean = false;

  constructor(private service: CustomerService,
    private router: Router
  ) {}
  navigateToBookCar(car: any): void {
    if (!this.isCarBooked(car)) {
      this.router.navigate(['/customer/book', car.id]); // Điều hướng sang giao diện book-car
    }
  }

  ngOnInit() {
    this.getAllCars();
  }

  bookACar(car: any): void {
    const bookACarDto = {
        carId: car.id,
        // Các thuộc tính khác nếu cần
    };

    this.service.bookACar(bookACarDto).subscribe({
        next: (res) => {
            console.log('Booking successful!', res);
            alert('Car booked successfully!');
            this.getAllCars(); // Cập nhật danh sách xe sau khi đặt
        },
        error: (err) => {
            console.error('Error booking car', err);
            console.log('Error details:', err.error);
            alert('Failed to book the car. Please try again later.');
        },
    });
}

  // Phương thức xử lý hình ảnh
  private processCarImage(car: {
    imageFormat: string;
    returnedImage: string;
  }): string {
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

  getAllCars() {
    this.cars = [];
    this.service.getAllCars().subscribe((res: any[]) => {
      res.forEach((car) => {
        car.processedImg = this.processCarImage(car);
        this.cars.push(car);
      });
    });
  }

  isCarBooked(car: any): boolean {
    return car.bookCarStatus === 1; // Trả về true nếu xe đã được đặt (1)
  }
}

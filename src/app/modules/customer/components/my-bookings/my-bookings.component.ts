import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent {

  bookings: any;
  isSpinning= false;

  constructor(private service: CustomerService) {
    this.getMyBookings();
  }

  getMyBookings() {
    this.isSpinning = true;
    this.service.getBookingsByUserId().subscribe((res) => {
      this.isSpinning = false;
      // console.log(res);
      this.bookings = res;
    });
  }

  getStatusString(status: number): string {
    switch (status) {
      case 0:
        return 'PENDING...';
      case 1:
        return 'APPROVED';
      case 2:
        return 'REJECTED';
      default:
        return 'UNKNOWN';
    }
  }
}

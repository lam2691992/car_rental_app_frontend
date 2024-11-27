import { Component } from '@angular/core';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.css'],
})
export class GetBookingsComponent {
  bookings: any[] = [];
  isSpinning = false;
  isChangingStatus: { [key: number]: boolean } = {};

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {
    this.getBookings();
  }

  getBookings() {
    this.isSpinning = true;
    this.adminService.getCarBookings().subscribe(
      (res) => {
        this.bookings = res;
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Failed to fetch bookings.');
      }
    );
  }

  changeBookingStatus(bookingId: number, status: number) {
    this.isChangingStatus[bookingId] = true;
    this.adminService.changeBookingStatus(bookingId, status).subscribe(
      (res) => {
        this.isChangingStatus[bookingId] = false;
        this.message.success('Booking status changed successfully!');
        this.getBookings(); // Refresh bookings list
      },
      (error) => {
        this.isChangingStatus[bookingId] = false;
        this.message.error('Something went wrong.');
      }
    );
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

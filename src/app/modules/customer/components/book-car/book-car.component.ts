import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrls: ['./book-car.component.css'],
})
export class BookCarComponent {
  carId: number = this.activatedRoute.snapshot.params['id'];
  car: any;
  processedImage: any;
  validateForm!: FormGroup;
  isSpinning = false;
  dateFormat: string = 'dd/MM/yyyy';
  selectedDate: Date | null = null;

  constructor(
    private service: CustomerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.carId = params['id'];
      this.getCarById();
    });

    this.validateForm = this.fb.group({
      toDate: [null, Validators.required],
      fromDate: [null, Validators.required],
    });
  }

  getFormControl(controlName: string) {
    return this.validateForm.get(controlName) as FormControl;
  }

  getCarById() {
    this.service.getCarById(this.carId).subscribe((res) => {
      console.log(res);
      this.processedImage = this.service.processCarImage(res);
      this.car = res;
    });
  }

  bookACar(data: any) {
    if (!this.validateForm.valid) {
      // Đánh dấu tất cả các trường để hiển thị lỗi
      this.validateForm.markAllAsTouched();
      // this.message.error('Please fill in all required fields', { nzDuration: 3000 });
      return;
    }

    if (new Date(data.toDate) < new Date(data.fromDate)) {
      this.message.error('To Date must be after From Date', {
        nzDuration: 3000,
      });
      return;
    }

    this.isSpinning = true;

    let bookACarDto = {
      toDate: data.toDate ? data.toDate.toISOString() : null,
      fromDate: data.fromDate ? data.fromDate.toISOString() : null,
      userId: StorageService.getUserId(),
      carId: this.carId,
    };

    console.log('Sending:', bookACarDto);

    this.service.bookACar(bookACarDto).subscribe(
      (res) => {
        console.log(res);
        this.message.success('Car booked successfully', { nzDuration: 3000 });
        this.router.navigateByUrl('/customer/dashboard');
      },
      (error) => {
        console.error('Booking error:', error);
        this.message.error('Something went wrong', { nzDuration: 3000 });
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.validateForm.get(controlName);

    if (control?.hasError('required')) {
      return `${
        controlName === 'fromDate' ? 'From Date' : 'To Date'
      } is required.`;
    }

    return '';
  }
}

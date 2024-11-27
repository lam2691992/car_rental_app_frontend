import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.css'],
})
export class SearchCarComponent {
  isSpinning = false;
  cars: any = [];

  searchCarForm!: FormGroup;
  listOfBrands: string[] = [];
  listOfType: string[] = [];
  listOfColor: string[] = [];
  listOfTransmission: string[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private message: NzMessageService
  ) {
    this.searchCarForm = this.fb.group({
      brand: [null, [Validators.required]],
      type: [null, [Validators.required]],
      color: [null],
      transmission: [null],
      email: [null],
      minPrice: [null],
      maxPrice: [null],
    });
  }

  ngOnInit(): void {
    this.loadCarData();
  }
  
  loadCarData() {
    this.customerService.getBrands().subscribe(
      (data) => {
        this.listOfBrands = data;
      },
      (err) => {
        console.error('Lỗi khi lấy danh sách brands:', err);
        this.message.error('Failed to load car brands.');
      }
    );

    this.customerService.getTypes().subscribe(
      (data) => {
        this.listOfType = data;
      },
      (err) => {
        console.error('Lỗi khi lấy danh sách types:', err);
        this.message.error('Failed to load car types.');
      }
    );

    this.customerService.getColors().subscribe(
      (data) => {
        this.listOfColor = data;
      },
      (err) => {
        console.error('Lỗi khi lấy danh sách colors:', err);
        this.message.error('Failed to load car colors.');
      }
    );

    this.customerService.getTransmissions().subscribe(
      (data) => {
        this.listOfTransmission = data;
      },
      (err) => {
        console.error('Lỗi khi lấy danh sách transmissions:', err);
        this.message.error('Failed to load car transmissions.');
      }
    );
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
        mimeType = 'image/png';
    }
    return `data:${mimeType};base64,${car.returnedImage}`;
  }

  // Phương thức tìm kiếm xe
  searchCar() {
    // validate form
    if (this.searchCarForm.invalid) {
      if (this.searchCarForm.get('brand')?.hasError('required')) {
        this.message.error('Brand is required', { nzDuration: 3000 });
      }
      if (this.searchCarForm.get('type')?.hasError('required')) {
        this.message.error('Type is required', { nzDuration: 3000 });
      }
      return;
    }
  
    this.isSpinning = true;
    console.log(this.searchCarForm.value);
  
    this.cars = []; // Reset danh sách xe trước khi gọi API
  
    this.customerService.searchCar(this.searchCarForm.value).subscribe(
      (res) => {
        console.log(res);
  
        // Kiểm tra nếu có kết quả trả về từ API
        if (res?.carDtoList && res.carDtoList.length > 0) {
          this.cars = res.carDtoList.map((car: any) => {
            car.processedImg = this.processCarImage(car);
            return car;
          });
        } else {
          // hiển thị nếu danh sách xe rỗng
          this.message.create('warning', 'No cars found', {nzDuration:3000});
        }
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
        this.message.create('error', 'Error occurred while searching cars');
        console.error('Lỗi khi gọi API:', err);
      }
    );
  }
  
  
}

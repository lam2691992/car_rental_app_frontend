import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { noteLengthValidator } from 'src/app/shared/validators/async-validators';
// import { noteLengthValidator } from '../../../shared/validators/async-validators';
@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.css'],
})
export class PostCarComponent implements OnInit {
  isSpinning: boolean = false;
  selectedFile: File | null = null;
  imgPreview: string | ArrayBuffer | null = null;
  postCarForm!: FormGroup;

  listOfBrands = [
    'BMW',
    'AUDI',
    'TOYOTA',
    'HONDA',
    'MAZDA',
    'KIA',
    'LEXUS',
    'VINFAST',
  ];
  listOfType = ['Petrol', 'Hybrid', 'Electric', 'Diesel'];
  listOfColor = ['Red', 'White', 'Blue', 'Black', 'Grey', 'Silver'];
  listOfTransmission = ['Manual', 'Automatic'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postCarForm = this.fb.group({
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required],
      noted: this.fb.array([]), // FormArray để chứa các ghi chú
    });
  }

  get noted(): FormArray {
    return this.postCarForm.get('noted') as FormArray;
  }

  // Hàm thêm ghi chú
  addNoted(): void {
    const notedGroup = this.fb.group({
      noted: [
        null,
        Validators.required,
        [noteLengthValidator(10, 100)], // Async validator kiểm tra độ dài
      ],
    });
    this.noted.push(notedGroup);
  }

  // Hàm xóa ghi chú
  removeNoted(index: number): void {
    this.noted.removeAt(index);
  }

  // Gửi form
  postCar(): void {
    if (this.postCarForm.invalid) {
      Object.keys(this.postCarForm.controls).forEach((field) => {
        const control = this.postCarForm.get(field);
        if (control instanceof FormArray) {
          control.controls.forEach((arrayControl) => arrayControl.markAsTouched());
        } else {
          control?.markAsTouched();
        }
      });
      this.message.error('Please fill in all required fields', { nzDuration: 5000 });
      return;
    }
  
    this.isSpinning = true;
    const formData = new FormData();
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    const fields = [
      'brand',
      'name',
      'type',
      'color',
      'transmission',
      'price',
      'description',
      'year',
    ];
    fields.forEach((field) => {
      const value = this.postCarForm.get(field)?.value;
      if (value !== null && value !== undefined) {
        formData.append(field, value.toString());
      }
    });
  
    // Lấy giá trị của FormArray `noted`
    const notedValues = this.noted.controls.map((control) => control.value.noted);
  
    // Thêm console.log để kiểm tra dữ liệu
    console.log('Noted Values:', notedValues); // Kiểm tra giá trị từ FormArray
    console.log('Form Data before sending:', {
      ...fields.reduce((acc, field) => ({
        ...acc,
        [field]: this.postCarForm.get(field)?.value,
      }), {}),
      noted: notedValues,
    });
  
    formData.append('notes', JSON.stringify(notedValues));
  
    this.adminService.postCar(formData).subscribe(
      (res) => {
        this.isSpinning = false;
        this.message.success('Car posted successfully', { nzDuration: 3000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      (err) => {
        this.isSpinning = false;
        console.error('Error posting car:', err);
        this.message.error('Failed to upload Car', { nzDuration: 3000 });
      }
    );
  }
  
  

  // Xử lý khi người dùng chọn file
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  // Hiển thị ảnh xem trước
  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}

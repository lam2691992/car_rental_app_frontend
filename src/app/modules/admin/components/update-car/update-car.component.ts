import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css'],
})
export class UpdateCarComponent {
  [x: string]: any;
  carId: number = this.activatedRoute.snapshot.params['id'];
  imgChanged: boolean = false;
  imagePreview: string | null = null;
  selectedFile: any;
  imgPreview: string | ArrayBuffer | null = null;
  existingImage: string | null = null;
  carDto: any; // Tạo carDto để lưu trữ dữ liệu xe
  updateForm!: FormGroup;
  isSpinning: boolean = false;
  validateForm!: FormGroup;
  listOfOptions: Array<{ label: string; value: string }> = [];
  listOfBrands = ['BMW', 'AUDI', 'TOYOTA', 'HONDA', 'MAZDA', 'KIA', 'LEXUS', 'VINFAST'];
  listOfType = ['Petrol', 'Hybrid', 'Electric', 'Diesel'];
  listOfColor = ['Red', 'White', 'Blue', 'Black', 'Grey', 'Silver'];
  listOfTransmission = ['Manual', 'Automatic'];

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null as Date | null, Validators.required],
    });
    this.getCarById();
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

  getCarById() {
    this.isSpinning = true;
    this.adminService.getCarById(this.carId).subscribe((res) => {
      this.isSpinning = false;
      // Lưu dữ liệu trả về vào carDto
      this.carDto = res;
      // Xử lý hình ảnh với carDto
      this.existingImage = this.processCarImage(this.carDto);
      console.log(this.carDto);
      if (res) {
        res.year = new Date(res.year);
        this.updateForm.patchValue(this.carDto);
      }
    });
  }
  updateCar() {
    // Kiểm tra tính hợp lệ của form
    if (this.updateForm.invalid) {
      this.message.error("Please fill in all required fields", { nzDuration: 5000 });
      return;
    }
  
    // Bắt đầu hiển thị spinner
    this.isSpinning = true;
    
    const formData = new FormData();
    
    // Kiểm tra và thêm file ảnh nếu có thay đổi
    if (this.imgChanged && this.selectedFile) {
      console.log('File selected:', this.selectedFile);
      formData.append('image', this.selectedFile);
    } else {
      console.warn('No image selected or image not changed');
    }
  
    // Lấy các giá trị từ form và thêm vào FormData
    const fields = ['brand', 'name', 'type', 'color', 'transmission', 'price', 'description', 'year'];
    fields.forEach(field => {
      const control = this.updateForm.get(field);
      if (control) {
        const value = control.value;
        if (value !== null && value !== undefined) {
          formData.append(field, value.toString());
          console.log(`Added field ${field}:`, value);
        }
      } else {
        console.warn(`Form control not found: ${field}`);
      }
    });
  
    // Debug thông tin trong FormData
    console.log('FormData content:');
formData.forEach((value, key) => {
  console.log(`${key}:`, value);
});

  
    // Gửi yêu cầu cập nhật
    this.adminService.updateCar(this.carId, formData).subscribe({
      next: (res) => {
        this.isSpinning = false;
        this.message.success("Car updated successfully", { nzDuration: 3000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        this.isSpinning = false;
        console.error('Error updating car:', err);
        this.message.error("Failed to update Car", { nzDuration: 3000 });
      }
    });
  }
  
  

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.imgChanged = true; // Đánh dấu rằng ảnh đã thay đổi
      this.previewImage(this.selectedFile); // Gọi hàm previewImage
      this.existingImage = null; // Đặt existingImage thành null khi chọn ảnh mới
    } else {
      console.error('No file selected or input element not found');
    }
  }
  
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; // Cập nhật imagePreview
      this.existingImage = this.imagePreview; // Cập nhật existingImage để hiển thị hình ảnh mới
    };
    reader.readAsDataURL(file);
  }
}

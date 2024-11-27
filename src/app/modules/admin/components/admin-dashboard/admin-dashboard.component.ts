
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  cars: any = [];

  constructor(
    private adminService: AdminService,
    private messageService: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllCars();
  }

  // Phương thức xử lý hình ảnh
  private processCarImage(car: { imageFormat: string; returnedImage: string }): string {
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
    this.adminService.getAllCars().subscribe((res: any[]) => {
      console.log(res); // Kiểm tra dữ liệu trả về từ API
      res.forEach((car) => {
        car.processedImg = this.processCarImage(car);
        car.note = car.notes && car.notes.length > 0 ? car.notes.join(', ') : 'No additional notes';
        this.cars.push(car);
      });
    });
  }
  

  deleteCar(id: number) {
    // Hiển thị hộp thoại xác nhận
    this.modalService.confirm({
      nzTitle: 'Do you want to delete this car?',
      nzContent: '<b style="color: red;">This action cannot be undone!</b>',
      nzOnOk: () => {
        // Nếu người dùng xác nhận, thực hiện xóa
        this.adminService.deleteCar(id).subscribe(() => {
          this.getAllCars();
          this.messageService.success('Delete car successfully', {
            nzDuration: 3000,
          });
        });
      },
      nzOnCancel: () => {
        // Nếu người dùng hủy bỏ
        console.log('Delete action has been canceled.');
      }
    });
  }
}

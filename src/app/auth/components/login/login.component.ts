import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  [x: string]: any;
  isSpinning: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.email],
      ],
      password: [null, [Validators.required]],
    });

    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  login() {
    this.loginForm.get('email')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  
    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.message.error('Email is required');
      } else if (this.loginForm.get('email')?.hasError('email')) {
        this.message.error('Please enter a valid email');
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.message.error('Password is required');
      }
      return;
    }

    this.isSpinning = true;
    console.log('Đăng nhập với thông tin:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        console.log(res);
        if (res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole,
          };
          StorageService.saveUser(user);
          StorageService.saveToken(res.jwt);

          // Chuyển hướng dựa trên vai trò người dùng
          if (StorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('/admin/dashboard');
          } else if (StorageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl('/customer/dashboard');
          } else {
            this.message.error('Bad credentials');
          }
        }
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
        console.error('Lỗi khi đăng nhập:', err);

        // Kiểm tra mã trạng thái HTTP
        if (err.status === 401) {
          this.message.error('Incorrect email or password', {
            nzDuration: 5000,
          });
        } else {
          this.message.error('Something went wrong. Please try again.', {
            nzDuration: 5000,
          });
        }
      }
    );
  }
}

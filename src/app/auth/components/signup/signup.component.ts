import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { emailExistsValidator } from '../../../shared/validators/async-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isSpinning: boolean = false;
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.email],
        [emailExistsValidator(this.authService)],
      ],
      password: [null, Validators.required],
      confirmPassword: [null, [Validators.required, this.confirmationValidate]],
    });
  }

  confirmationValidate = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signupForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  register() {
    console.log(this.signupForm.value);
    this.authService.register(this.signupForm.value).subscribe((res) => {
      console.log(res);
      if (res.data && res.data.id != null) {
        this.message.success('REGISTRATION SUCCESSFUL', { nzDuration: 3000 });
      } else {
        this.message.error('SOMETHING WENT WRONG', { nzDuration: 3000 });
        this.router.navigateByUrl('/login');
      }
      (error: HttpErrorResponse) => {
        if (error.status === 406) {
          console.log('This email already registered');
        }
      };
    });
  }
}

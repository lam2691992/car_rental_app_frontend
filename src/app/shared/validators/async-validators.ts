import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth/auth.service';

// sign up async validation
export function emailExistsValidator(
  authService: AuthService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // Không kiểm tra nếu không có giá trị
    }
    return authService.checkEmailExists(control.value).pipe(
      debounceTime(300), // Chờ 300ms trước khi gửi request
      map((response) => (response.exists ? { emailExists: true } : null)), // Trả về lỗi nếu email đã tồn tại
      catchError(() => of(null)) // Bỏ qua lỗi
    );
  };
}

// dynamic form async validation
export function noteLengthValidator(
  minLength: number,
  maxLength: number
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null); // Không kiểm tra nếu không có giá trị
    }

    // Kiểm tra độ dài
    const noteLength = control.value.length;
    if (noteLength < minLength || noteLength > maxLength) {
      return of({
        invalidLength: { requiredMin: minLength, requiredMax: maxLength },
      });
    }

    return of(null); // Hợp lệ
  };
}

import { Component } from '@angular/core';
import { ApiService } from '../../Services/Api Services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClarityModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  errorMessage: string = '';

  loginForm = new FormGroup({
    empcode: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)  // At least 1 letter, 1 number, 8 char
    ]),
    rememberMe: new FormControl(false)
  });
 
  constructor(private authService: ApiService, private router: Router) {}

  ngOnInit() {
    sessionStorage.clear();
    localStorage.clear();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = {
      Email: this.loginForm.value.empcode,
      password: this.loginForm.value.password
    };

    this.authService.Login(loginData).subscribe({
      next: (res: any) => {
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('token', res);
        } else {
          sessionStorage.setItem('User', JSON.stringify({ res }));
        }
     localStorage.setItem('role',JSON.stringify( res.role ));
     console.log('User role:', res.role); // Store user role for admin check
        this.router.navigate(['/Homepage']);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Invalid Login';
      }
    });
  }
}
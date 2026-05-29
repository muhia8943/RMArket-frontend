import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  api = "https://rmarket-backend.onrender.com/api/users";

  isRegisterMode: boolean = false;

  // LOGIN DATA
  loginData = {
    email: "",
    password: ""
  };

  // REGISTER DATA
  registerData = {
    username: "",
    email: "",
    password: "",
    phonenumber: ""
  };

  switchToRegister(event: Event): void {
    event.preventDefault();
    this.isRegisterMode = true;
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.isRegisterMode = false;
  }

  // ================= LOGIN =================
  login() {

    this.http.post<any>(`${this.api}/login`, this.loginData)
    .subscribe({
      next: (res) => {

        console.log("LOGIN RESPONSE:", res);

        localStorage.setItem("userId", String(res.userId));
        localStorage.setItem("role", res.role);

        alert("Login successful");

        if (res.role === "admin") {
          this.router.navigate(['/admin']);
        }

        if (res.role === "user") {
          this.router.navigate(['']);
        }

      },
      error: () => {
        alert("Login failed");
      }
    });

  }

  // ================= REGISTER =================
  register() {

    this.http.post(`${this.api}/register`, this.registerData)
    .subscribe({
      next: () => {

        alert("Registration successful");

        this.isRegisterMode = false;

      },
      error: () => {

        alert("Registration failed");

      }
    });

  }

}
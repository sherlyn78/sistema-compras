import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;

    this.http.post<string>('http://localhost:8080/api/auth/login', {
      username: this.username,
      password: this.password
    }, { responseType: 'text' as 'json' }).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        const role = decoded.role;


//opciones
        if (role == 'ADMIN'){
          this.router.navigate(['/dashboard']);
        }else if (role == 'VENDEDOR'){
          this.router.navigate(['/dashboard-vendedor']);
        }
      },
      //error
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}
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

  // Cambiamos <string> por <any> para que nos deje leer el .token
  this.http.post<any>('http://localhost:8080/api/auth/login', {
    username: this.username,
    password: this.password
  }).subscribe({
    next: (res) => {
      this.loading = false;
      const token = res.token;
      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Contenido del token:", payload);

    
      const role = payload.role;


      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'ROLE_VENDEDOR' || role === 'ROLE_USER') {
        this.router.navigate(['/dashboardvendedor']);
      } else {
        console.error("Rol no reconocido:", role);
      }

      },
      
      error: (err) => {
      this.loading = false;
      this.error = typeof err.error === 'string'
        ? err.error.replace(/"/g, '')
        : err.error?.message || 'Credenciales incorrectas';
    }
    });
  }
  }
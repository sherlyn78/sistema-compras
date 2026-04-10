import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  nombre = '';
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  registrar() {
    this.error = '';
    this.loading = true;

    this.http.post('http://localhost:8080/api/usuarios', {
      username: this.username,
      email: this.email,
      password: this.password
      rol: { nombre: 'VENDEDOR' }//siempre debe ser vendedor
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },

      error: (err) => {
        if (err.status === 500) {
            this.error = 'El correo o usuario ya está registrado';
        } else {
            this.error = 'Error al registrar usuario';
        }
        this.loading = false;
    }

    });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  seccionActiva = 'inicio';
  mostrarFormUsuario = false;
  usuarios: any[] = [];

  usuarioActual = { username: '', rol: '' };
  nuevoUsuario = { username: '', email: '', password: '',rol: '' };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token')
    if (token){
      const pay = JSON.parse(atob(token.split('.')[1]));
      this.usuarioActual.username = pay.sub;
    }
    this.cargarUsuarios();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'usuarios') this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:8080/api/usuarios',
      { headers: this.getHeaders() }).subscribe({
      next: (data) => this.usuarios = data,
      error: () => console.log('Error cargando usuarios')
    });
  }

  crearUsuario() {
    this.http.post('http://localhost:8080/api/usuarios', this.nuevoUsuario,
      { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarFormUsuario = false;
        this.nuevoUsuario = { username: '', email: '', password: '',rol: '' };
        this.cargarUsuarios();
      },
      error: () => alert('Error al crear usuario')
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.http.delete(`http://localhost:8080/api/usuarios/${id}`,
        { headers: this.getHeaders() }).subscribe({
        next: () => this.cargarUsuarios(),
        error: () => alert('Error al eliminar')
      });
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
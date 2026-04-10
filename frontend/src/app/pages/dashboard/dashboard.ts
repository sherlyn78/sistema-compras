import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  // Secciones
  seccionActiva = 'inicio';

  // Usuarios
  mostrarFormUsuario = false;
  usuarios: any[] = [];
  usuarioActual = { username: '', rol: '' };
  nuevoUsuario = { username: '', email: '', password: '', rol: { nombre: 'ADMIN' } };
  //editar usuarios
  isEditando: boolean = false;
  idUsuarioAEditar: number | null = null;

  // Productos
  mostrarFormProducto = false;
  productos: any[] = [];
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    cantidadInventario: 0,
    estado: 'ACTIVO'
  };

  constructor(private router: Router, private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Solo ejecutamos localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const pay = JSON.parse(atob(token.split('.')[1]));
          this.usuarioActual.username = pay.sub;
        } catch (e) {
          console.error('Error al decodificar el token');
        }
      }
      this.cargarUsuarios();
    }
  }

  // Headers con token
  getHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }
    return new HttpHeaders();
  }

  // Cambiar secciones dinámicamente
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'usuarios') this.cargarUsuarios();
    if (seccion === 'productos') this.cargarProductos();
  }

  // =======================
  // USUARIOS ADMIN
  // =======================
  cargarUsuarios() {
this.http.get<any[]>('http://localhost:8080/api/usuarios', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.usuarios = [...data]; // Usamos el operador spread para crear una nueva referencia y que Angular detecte el cambio
          this.cdr.detectChanges();  // Forzamos a Angular a revisar la vista
        },
        error: (err) => console.log('Error cargando usuarios', err)
      });
  }

  // Este método ahora decide si CREA o EDITA
  guardarUsuario() {
  // 1. Creamos el objeto limpio que el Backend entiende
  const datosParaEnviar = {
    username: this.nuevoUsuario.username,
    email: this.nuevoUsuario.email,
    password: this.nuevoUsuario.password,
    rol: { nombre: this.nuevoUsuario.rol.nombre } // Estructura idéntica para Crear y Editar
  };

  if (this.isEditando && this.idUsuarioAEditar !== null) {
    // LÓGICA DE ACTUALIZACIÓN (PUT)
    this.http.put(`http://localhost:8080/api/usuarios/${this.idUsuarioAEditar}`, datosParaEnviar, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert('Usuario actualizado con éxito');
          this.cancelarEdicion();
          this.cargarUsuarios(); // Refresca la tabla
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el usuario');
        }
      });
  } else {
    // LÓGICA DE CREACIÓN (POST)
    this.http.post('http://localhost:8080/api/usuarios', datosParaEnviar, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert('¡Usuario creado con éxito!');
          this.cancelarEdicion(); // Limpia y cierra el formulario
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear usuario. Revisa que los datos sean únicos.');
        }
      });
  }
}
  crearUsuario() {
    // Aseguramos que el objeto enviado sea limpio
    const usuarioParaEnviar = {
      username: this.nuevoUsuario.username,
      email: this.nuevoUsuario.email,
      password: this.nuevoUsuario.password,
      rol: { nombre: this.nuevoUsuario.rol.nombre } // Enviamos el objeto Rol
    };

    this.http.post('http://localhost:8080/api/usuarios', usuarioParaEnviar, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          console.log('Usuario creado:', res);
          alert('¡Usuario creado con éxito!');
          this.mostrarFormUsuario = false;
          
          // REINICIAR FORMULARIO
          this.nuevoUsuario = { username: '', email: '', password: '', rol: { nombre: 'ADMIN' } };
          
          // FORZAR ACTUALIZACIÓN DE LA LISTA
          this.cargarUsuarios(); 
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear usuario. Revisa que el username/email no existan.');
        }
      });
  }


  prepararEdicion(usuario: any) {
  this.isEditando = true;
  this.mostrarFormUsuario = true;
  this.idUsuarioAEditar = usuario.id;
  
  this.nuevoUsuario = {
    username: usuario.username,
    email: usuario.email,
    password: '',
    // Mapeamos el rol como objeto para el Backend
    rol: { nombre: usuario.rol?.nombre || 'ADMIN' }
  };
}

  cancelarEdicion() {
  this.mostrarFormUsuario = false;
  this.isEditando = false;
  this.idUsuarioAEditar = null;
  this.nuevoUsuario = { username: '', email: '', password: '', rol: { nombre: 'ADMIN' } };
}

  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.http.delete(`http://localhost:8080/api/usuarios/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => this.cargarUsuarios(),
          error: () => alert('Error al eliminar usuario')
        });
    }
  }


  

  // =======================
  // PRODUCTOS
  // =======================
  cargarProductos() {
    this.http.get<any[]>('http://localhost:8080/api/productos', { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.productos = data,
        error: () => console.log('Error cargando productos')
      });
  }

  crearProducto() {
    this.http.post('http://localhost:8080/api/productos', this.nuevoProducto, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.mostrarFormProducto = false;
          this.nuevoProducto = { nombre: '', descripcion: '', precioCompra: 0, precioVenta: 0, cantidadInventario: 0, estado: 'ACTIVO' };
          this.cargarProductos();
        },
        error: () => alert('Error al crear producto')
      });
  }

  eliminarProducto(id: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.http.delete(`http://localhost:8080/api/productos/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => this.cargarProductos(),
          error: () => alert('Error al eliminar producto')
        });
    }
  }

  // =======================
  // SESIÓN
  // =======================
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
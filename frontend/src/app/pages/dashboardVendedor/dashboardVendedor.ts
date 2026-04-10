import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboardVendedor.html',
  styleUrl: './dashboardVendedor.css'
})
export class DashboardVendedorComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api';

  // Secciones
  seccionActiva = 'inicio';

  // Usuario actual
  usuarioActual = { username: '' };

  // Productos
  productos: any[] = [];

  // Ventas
  ventas: any[] = [];
  mostrarFormVenta = false;
  errorStock = '';
  totalVenta = 0;

  nuevaVenta = {
    cliente: '',
    detalles: [] as {
      productoId: any;
      nombreProducto: string;
      cantidad: number;
      precioUnitario: number;
      stockDisponible: number;
    }[]
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Leer token y verificar rol
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    this.usuarioActual.username = payload.sub;

    // ✅ GUARD DE ROL: si es admin, redirigir a su dashboard
    const rol = payload.rol || payload.role || payload.roles?.[0];
    if (rol === 'admin' || rol === 'ADMIN' || rol === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    // Si es vendedor, cargar sus datos
    this.cargarProductos();
    this.cargarVentas();
  }

  // Headers con token JWT
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Cambiar sección
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'productos') this.cargarProductos();
    if (seccion === 'ventas')   { this.cargarProductos(); this.cargarVentas(); }
  }

  // =======================
  // PRODUCTOS (solo lectura)
  // =======================
  cargarProductos() {
    this.http.get<any[]>(`${this.apiUrl}/productos`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.productos = data,
        error: () => console.error('Error cargando productos')
      });
  }

  // =======================
  // VENTAS
  // =======================
  cargarVentas() {
    this.http.get<any[]>(`${this.apiUrl}/ventas`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.ventas = data,
        error: () => console.error('Error cargando ventas')
      });
  }

  agregarDetalle() {
    this.nuevaVenta.detalles.push({
      productoId: '',
      nombreProducto: '',
      cantidad: 1,
      precioUnitario: 0,
      stockDisponible: 0
    });
  }

  onProductoSeleccionado(index: number, productoId: any) {
    const producto = this.productos.find(p => p.id == productoId);
    if (!producto) return;
    this.nuevaVenta.detalles[index].nombreProducto  = producto.nombre;
    this.nuevaVenta.detalles[index].precioUnitario  = producto.precioVenta;
    this.nuevaVenta.detalles[index].stockDisponible = producto.cantidadInventario;
    this.calcularTotal();
  }

  quitarDetalle(index: number) {
    this.nuevaVenta.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalVenta = this.nuevaVenta.detalles
      .reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);
  }

  registrarVenta() {
    this.errorStock = '';

    if (!this.nuevaVenta.cliente.trim()) {
      this.errorStock = 'Ingresa el nombre del cliente.';
      return;
    }
    if (this.nuevaVenta.detalles.length === 0) {
      this.errorStock = 'Agrega al menos un producto.';
      return;
    }

    // Validar stock antes de enviar
    for (const d of this.nuevaVenta.detalles) {
      if (!d.productoId) {
        this.errorStock = 'Selecciona un producto en todos los renglones.';
        return;
      }
      if (d.cantidad <= 0) {
        this.errorStock = 'La cantidad debe ser mayor a 0.';
        return;
      }
      if (d.cantidad > d.stockDisponible) {
        this.errorStock = `"${d.nombreProducto}" solo tiene ${d.stockDisponible} unidades disponibles.`;
        return;
      }
    }

    const payload = {
      cliente: this.nuevaVenta.cliente,
      total:   this.totalVenta,
      detalles: this.nuevaVenta.detalles.map(d => ({
        productoId:     d.productoId,
        cantidad:       d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal:       d.cantidad * d.precioUnitario
      }))
    };

    // HTTP directo, sin servicio externo
    this.http.post(`${this.apiUrl}/ventas`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.cancelarVenta();
          this.cargarVentas();
          this.cargarProductos(); // refresca stock visible
        },
        error: () => {
          this.errorStock = 'Error al registrar la venta. Intenta de nuevo.';
        }
      });
  }

  cancelarVenta() {
    this.mostrarFormVenta = false;
    this.errorStock = '';
    this.totalVenta = 0;
    this.nuevaVenta = { cliente: '', detalles: [] };
  }

  // =======================
  // SESIÓN
  // =======================
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
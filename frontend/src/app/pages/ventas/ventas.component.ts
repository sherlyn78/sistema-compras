import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface VentaProducto {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Venta {
  id: number;
  cliente: string;
  productos: VentaProducto[];
  total: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {

  clientes: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  productosDisponibles: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 10, stock: 100 },
    { id: 2, nombre: 'Producto 2', precio: 15, stock: 50 },
    { id: 3, nombre: 'Producto 3', precio: 20, stock: 75 },
  ];

  ventaActual: Venta = this.getVentaVacia();
  ventasRegistradas: Venta[] = [];

  getVentaVacia(): Venta {
    return { id: 0, cliente: '', productos: [], total: 0 };
  }

  agregarProducto(producto: Producto) {
    const existente = this.ventaActual.productos.find(p => p.producto.id === producto.id);
    if (existente) {
      existente.cantidad++;
      existente.subtotal = existente.cantidad * existente.producto.precio;
    } else {
      this.ventaActual.productos.push({
        producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
    this.calcularTotal();
  }

  actualizarCantidad(vp: VentaProducto, cantidad: number) {
    vp.cantidad = cantidad;
    vp.subtotal = vp.producto.precio * cantidad;
    this.calcularTotal();
  }

  calcularTotal() {
    this.ventaActual.total = this.ventaActual.productos.reduce(
      (sum, p) => sum + p.subtotal, 0
    );
  }

  guardarVenta() {
    if (!this.ventaActual.cliente || this.ventaActual.productos.length === 0) return;

    this.ventaActual.id = new Date().getTime();
    this.ventasRegistradas.push({ ...this.ventaActual });

    // Actualizar inventario
    this.ventaActual.productos.forEach(vp => {
      const prod = this.productosDisponibles.find(p => p.id === vp.producto.id);
      if (prod) prod.stock -= vp.cantidad;
    });

    this.ventaActual = this.getVentaVacia();
  }

  eliminarProducto(vp: VentaProducto) {
    this.ventaActual.productos = this.ventaActual.productos.filter(p => p !== vp);
    this.calcularTotal();
  }

  cancelar() {
    this.ventaActual = this.getVentaVacia();
  }
}
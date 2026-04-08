import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface CompraProducto {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Compra {
  id: number;
  proveedor: string;
  productos: CompraProducto[];
  total: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  proveedores: string[] = ['Proveedor A', 'Proveedor B', 'Proveedor C'];
  productosDisponibles: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 10, stock: 100 },
    { id: 2, nombre: 'Producto 2', precio: 15, stock: 50 },
    { id: 3, nombre: 'Producto 3', precio: 20, stock: 75 },
  ];

  compraActual: Compra = this.getCompraVacia();
  comprasRegistradas: Compra[] = [];

  getCompraVacia(): Compra {
    return { id: 0, proveedor: '', productos: [], total: 0 };
  }

  agregarProducto(producto: Producto) {
    const existente = this.compraActual.productos.find(p => p.producto.id === producto.id);
    if (existente) {
      existente.cantidad++;
      existente.subtotal = existente.cantidad * existente.producto.precio;
    } else {
      this.compraActual.productos.push({
        producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
    this.calcularTotal();
  }

  actualizarCantidad(compraProducto: CompraProducto, cantidad: number) {
    compraProducto.cantidad = cantidad;
    compraProducto.subtotal = compraProducto.producto.precio * cantidad;
    this.calcularTotal();
  }

  calcularTotal() {
    this.compraActual.total = this.compraActual.productos.reduce(
      (sum, p) => sum + p.subtotal, 0
    );
  }

  guardarCompra() {
    if (!this.compraActual.proveedor || this.compraActual.productos.length === 0) return;

    this.compraActual.id = new Date().getTime();
    this.comprasRegistradas.push({ ...this.compraActual });

    // Actualizar inventario
    this.compraActual.productos.forEach(cp => {
      const prod = this.productosDisponibles.find(p => p.id === cp.producto.id);
      if (prod) prod.stock += cp.cantidad;
    });

    this.compraActual = this.getCompraVacia();
  }

  eliminarProducto(compraProducto: CompraProducto) {
    this.compraActual.productos = this.compraActual.productos.filter(p => p !== compraProducto);
    this.calcularTotal();
  }

  cancelar() {
    this.compraActual = this.getCompraVacia();
  }
}
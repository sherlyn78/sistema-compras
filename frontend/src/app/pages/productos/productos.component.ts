import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos: Producto[] = [];
  productoForm: Producto = this.getProductoVacio();
  editando: boolean = false;
  busqueda: string = '';

  getProductoVacio(): Producto {
    return { id: 0, nombre: '', descripcion: '', precio: 0, stock: 0 };
  }

  guardarProducto() {
    if (this.editando) {
      const index = this.productos.findIndex(p => p.id === this.productoForm.id);
      if (index !== -1) this.productos[index] = { ...this.productoForm };
      this.editando = false;
    } else {
      this.productoForm.id = new Date().getTime();
      this.productos.push({ ...this.productoForm });
    }
    this.productoForm = this.getProductoVacio();
  }

  editarProducto(producto: Producto) {
    this.productoForm = { ...producto };
    this.editando = true;
  }

  eliminarProducto(producto: Producto) {
    this.productos = this.productos.filter(p => p.id !== producto.id);
  }

  cancelar() {
    this.productoForm = this.getProductoVacio();
    this.editando = false;
  }

  filtrarProductos(): Producto[] {
    const term = this.busqueda.toLowerCase();
    return this.productos.filter(p => p.nombre.toLowerCase().includes(term));
  }
}
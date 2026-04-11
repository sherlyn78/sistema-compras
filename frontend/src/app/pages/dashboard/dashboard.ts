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
  productoEditando: any = null;
  busqueda = '';
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    cantidadInventario: 0,
    estado: 'ACTIVO'
    
  };

  //compras
  compras: any[] = [];
  mostrarFormCompra = false;
  errorCompra = '';
  totalCompra = 0;
  nuevaCompra = {
  proveedor: '',
  detalles: [] as {
    productoId: any;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
  }[]
};


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
    if (seccion === 'compras') { this.cargarCompras(); this.cargarProductos(); }
    if (seccion === 'ventas') { this.cargarVentas(); this.cargarProductos(); }
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
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    this.http.delete(`http://localhost:8080/api/usuarios/${id}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          // Filtrar la lista localmente
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.cdr.detectChanges(); // Forzar detección de cambios
          alert('Usuario eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar el usuario. Puede que tenga registros vinculados.');
        }
      });
  }
}


  //desactivar y activar usuariso
  toggleEstado(usuario: any) {
  const nuevoEstado = usuario.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  
  const datos = {
    username: usuario.username,
    email: usuario.email,
    password: '',
    rol: { nombre: usuario.rol?.nombre },
    status: nuevoEstado
  };
  
  console.log('Enviando:', JSON.stringify(datos));

  this.http.put(`http://localhost:8080/api/usuarios/${usuario.id}`, datos, { headers: this.getHeaders() })
  .subscribe({
    next: (res) => {
      console.log('Respuesta:', JSON.stringify(res));
      usuario.status = nuevoEstado;
      this.cargarUsuarios(); //refrescar la tabla
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Error al cambiar estado del usuario');
    }
  });
}

  

  // =======================
  // PRODUCTOS
  // =======================

  get productosFiltrados() {
  if (!this.busqueda.trim()) return this.productos;
  const q = this.busqueda.toLowerCase();
  return this.productos.filter(p =>
    p.nombre?.toLowerCase().includes(q) ||
    p.descripcion?.toLowerCase().includes(q)
  );
}

prepararEdicionProducto(producto: any) {
  this.productoEditando = { ...producto };
  this.mostrarFormProducto = false;
}

cancelarEdicionProducto() {
  this.productoEditando = null;
}

guardarEdicionProducto() {
  this.http.put(`http://localhost:8080/api/productos/${this.productoEditando.id}`,
    this.productoEditando, { headers: this.getHeaders() })
  .subscribe({
    next: () => {
      this.productoEditando = null;
      this.cargarProductos();
    },
    error: () => alert('Error al actualizar producto')
  });
}


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
  if (confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
    this.http.delete(`http://localhost:8080/api/productos/${id}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          // Actualizamos la lista local
          this.productos = this.productos.filter(p => p.id !== id);
          this.cdr.detectChanges();
          alert('Producto eliminado');
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          // Mensaje
          if (err.status === 500) {
            alert('No se puede eliminar: El producto ya tiene movimientos de compra o venta asociados.');
          } else {
            alert('Error al intentar eliminar el producto.');
          }
        }
      });
  }
}

    // =======================
    // Compras
    // =======================
  
  cargarCompras() {
  this.http.get<any[]>('http://localhost:8080/api/compras', { headers: this.getHeaders() })
    .subscribe({
      next: (data) => this.compras = data,
      error: () => console.error('Error cargando compras')
    });
}

agregarDetalleCompra() {
  this.nuevaCompra.detalles.push({
    productoId: '',
    nombreProducto: '',
    cantidad: 1,
    precioUnitario: 0
  });
}

onProductoCompraSeleccionado(index: number, productoId: any) {
  const producto = this.productos.find(p => p.id == productoId);
  if (!producto) return;
  this.nuevaCompra.detalles[index].nombreProducto = producto.nombre;
  this.nuevaCompra.detalles[index].precioUnitario = producto.precioCompra;
  this.calcularTotalCompra();
}

quitarDetalleCompra(index: number) {
  this.nuevaCompra.detalles.splice(index, 1);
  this.calcularTotalCompra();
}

calcularTotalCompra() {
  this.totalCompra = this.nuevaCompra.detalles
    .reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0);
}

registrarCompra() {
  this.errorCompra = '';

  if (!this.nuevaCompra.proveedor.trim()) {
    this.errorCompra = 'Ingresa el nombre del proveedor.';
    return;
  }
  if (this.nuevaCompra.detalles.length === 0) {
    this.errorCompra = 'Agrega al menos un producto.';
    return;
  }
  for (const d of this.nuevaCompra.detalles) {
    if (!d.productoId) {
      this.errorCompra = 'Selecciona un producto en todos los renglones.';
      return;
    }
    if (d.cantidad <= 0) {
      this.errorCompra = 'La cantidad debe ser mayor a 0.';
      return;
    }
  }

  const payload = {
    proveedor: this.nuevaCompra.proveedor,
    total: this.totalCompra,
    detalles: this.nuevaCompra.detalles.map(d => ({
      producto: { id: d.productoId },
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.cantidad * d.precioUnitario
    }))
  };

  this.http.post('http://localhost:8080/api/compras', payload, { headers: this.getHeaders() })
    .subscribe({
      next: () => {
        this.cancelarCompra();
        this.cargarCompras();
        this.cargarProductos(); // refresca stock
      },
      error: (err) => {
        this.errorCompra = `Error ${err.status}: ${err.error?.message || 'Intenta de nuevo'}`;
      }
    });
}

cancelarCompra() {
  this.mostrarFormCompra = false;
  this.errorCompra = '';
  this.totalCompra = 0;
  this.nuevaCompra = { proveedor: '', detalles: [] };
}


//ventas
cargarVentas() {
  this.http.get<any[]>('http://localhost:8080/api/ventas', { headers: this.getHeaders() })
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
    total: this.totalVenta,
    detalles: this.nuevaVenta.detalles.map(d => ({
      producto: { id: d.productoId },
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.cantidad * d.precioUnitario
    }))
  };

  this.http.post('http://localhost:8080/api/ventas', payload, { headers: this.getHeaders() })
    .subscribe({
      next: () => {
        this.cancelarVenta();
        this.cargarVentas();
        this.cargarProductos();
      },
      error: (err) => {
        this.errorStock = `Error ${err.status}: ${err.error?.message || 'Intenta de nuevo'}`;
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
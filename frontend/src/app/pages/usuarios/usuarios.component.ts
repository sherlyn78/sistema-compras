import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule], // necesario para *ngFor, *ngIf y ngModel
  templateUrl: './usuarios_main.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  usuarios: Usuario[] = [];
  usuarioForm: Usuario = this.getUsuarioVacio();
  editando: boolean = false;

  roles: string[] = ['Admin', 'Usuario', 'Supervisor'];

  getUsuarioVacio(): Usuario {
    return { id: 0, nombre: '', email: '', rol: 'Usuario', activo: true };
  }

  guardarUsuario() {
    if (this.editando) {
      const index = this.usuarios.findIndex(u => u.id === this.usuarioForm.id);
      if (index !== -1) this.usuarios[index] = { ...this.usuarioForm };
      this.editando = false;
    } else {
      this.usuarioForm.id = new Date().getTime();
      this.usuarios.push({ ...this.usuarioForm });
    }
    this.usuarioForm = this.getUsuarioVacio();
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioForm = { ...usuario };
    this.editando = true;
  }

  toggleActivo(usuario: Usuario) {
    usuario.activo = !usuario.activo;
  }

  cancelar() {
    this.usuarioForm = this.getUsuarioVacio();
    this.editando = false;
  }
}
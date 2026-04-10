import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private readonly router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');

    // Si no hay token fuera
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token)

      //Validar rol
      if (decoded.role === 'ADMIN') {
        return true;
      } else {
        this.router.navigate(['/no-autorizado']);
        return false;
      }

    }catch (error) {
      console.error('Error decodificando el token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}

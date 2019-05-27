import { Component } from "@angular/core";
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'


})
export class HeaderComponent {
  title:string = 'App Angular'

  constructor(private  authService: AuthService, private router: Router){

  }

  logout():void{
    this.authService.logout();
    swal('Logout', `Hola ${this.authService.usuario.username}, has cerrado sesión con exito!`, 'success');
    this.router.navigate(['/login']);
  }
}

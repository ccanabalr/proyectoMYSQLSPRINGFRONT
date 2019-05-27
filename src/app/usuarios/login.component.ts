import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import  swal  from 'sweetalert2';

import { AuthService} from './auth.service';
import { Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: String = "Por favor Sing In!";
  usuario:Usuario;

  constructor( private authService:AuthService, private router:Router ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      swal('Login', `Hola ${this.authService.usuario.username} ya estas autenticado `, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal('Error Login', 'Username o Password vacios!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
        console.log(response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        this.router.navigate(['/clientes']);
        swal('Login',`Hola ${usuario.username}, has iniciado sesion con exito`,'success');
      },
      err => {
        if(err.status == 400){
          swal('Error Login', 'Username o Password incorrectos!', 'error');
        }
      }
    );
  }

}

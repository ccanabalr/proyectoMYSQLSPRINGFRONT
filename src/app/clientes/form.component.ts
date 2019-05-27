import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  regiones: Region[];

  private titulo: String = 'Crear Cliente';

  private errores: String[];

  constructor(private clienteService: ClienteService,
  private router: Router,
  private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  cargarCliente(): void{
    this.activateRoute.params.subscribe( param => {
      let id = param['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        )
      }
    });
  }

  create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Cliente Nuevo',`El cliente ${cliente.nombre} ha sido creado con exito!`, 'success')
      },
      err => {
        this.errores = err.error.errors as String[];
        console.log("codigo de error desde el backend: "+ err.status);
        console.log(err.error.errors);
      }
    )
  }

  update(): void{
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.errors as String[];
        console.log("codigo de error desde el backend: "+ err.status);
        console.log(err.error.errors);
      }
    )
  }

  compararRegion(o1:Region, o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined?false:o1.id === o2.id;
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from "../cliente.service";
import { ModalService } from "./modal.service";
import swal from 'sweetalert2';
import {HttpEventType} from "@angular/common/http";
import { AuthService } from '../../usuarios/auth.service';

import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: String = "Detalle del Cliente";

  private fotoSeleccionada: File;
   progreso: number = 0;
  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
      private modalService: ModalService,
      private authService: AuthService 
      ) { }

  ngOnInit() {

  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
        swal('Error seleccionar imagen', 'El archivo debe ser del tipo imagen!', 'error');
        this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if (!this.fotoSeleccionada) {
        swal('Error upload', 'Debe seleccionar una foto!', 'error');
    }else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
            this.progreso =Math.round((event.loaded/event.total)*100);
        }else if(event.type == HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          swal('La foto se ha subido completamente', response.mensaje, 'success' );
        }
        //this.cliente = cliente;

      });
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada= null;
    this.progreso = 0;
  }

  delete(factura: Factura):void{
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })
    swalWithBootstrapButtons({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(cli => cli !== factura)
            swalWithBootstrapButtons(
              'Factura Eliminado!',
              `Factura ${factura.descripcion} eliminado con exite.`,
              'success'
            )
          }
        )
      }
    })
  }

}

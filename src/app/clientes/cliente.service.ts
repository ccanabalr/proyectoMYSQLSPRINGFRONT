import { Injectable } from '@angular/core';
//import { formatDate } from '@angular/common';
import { Cliente }  from "./cliente";
import { Region }  from "./region";
//import { CLIENTES } from "./clientes.json";
import { Observable,  throwError } from "rxjs";
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';


  constructor(private http: HttpClient, private router: Router) { }


  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  getClientes(page): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+"/page/"+page).pipe(
      map( (response:any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'fullDate','es-CO')
          return cliente;
        });
        return response;
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e =>{
        if(e.status==400){
            return throwError(e);
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e =>{
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e =>{
        if(e.status==400){
            return throwError(e);
        }

        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );;
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e =>{

        
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

}

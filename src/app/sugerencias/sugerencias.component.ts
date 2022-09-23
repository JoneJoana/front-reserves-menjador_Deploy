import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var swal: any;

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {

  nombre: string = '';
  mensaje: string = '';
  email: any;

  form: any = {
    nombre: null,
    email: null,
    mensaje: null
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  reload(login :NgForm){
    window.location.reload();
  }

  msjEnviado(f: NgForm){
    if(f.valid){
      const email = f.value;
      console.log(f.value)
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post('https://formspree.io/f/xaykooqy',
        { name: email.name, replyto: email.email, message: email.messages },
        { 'headers': headers }).subscribe(
          response => {
            console.log(response);
            swal({
              title: "Mensaje Enviado",
              text: "Te contestaremos lo antes posible. Gracias por contactarnos :)",
              icon: "success",
              buttons: [false, true],
              timer: 2300
              });

          }, (error) => {
            swal({
              text: "Fallo al enviar email. Lo sentimos, intentalo de nuevo",
              icon: "error",
              timer: 1400
            });
            console.log('ERROR REQUEST' + error.message);
          }
        );
    }

  }

}

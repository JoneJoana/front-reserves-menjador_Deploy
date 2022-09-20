import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
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

  constructor() { }

  ngOnInit(): void {
  }

  reload(login :NgForm){
    window.location.reload();
  }

  msjEnviado(){
    swal({
      title: "Mensaje Enviado",
        text: "Te contestaremos lo antes posible. Gracias por contactarnos :)",
      buttons: [false, true],
      timer: 2300
      });
    setTimeout (() => {
      window.location.reload();
    }, 2500);
  }

}

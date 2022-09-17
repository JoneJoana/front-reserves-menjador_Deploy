import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {

  nombre: string = '';
  email: string = '';
  mensaje: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  completeLogin(login :NgForm){
    login.reset();
  }

}

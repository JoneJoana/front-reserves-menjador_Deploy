import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    username: null,
    email: null,
    password: null
  }
  username?: string;
  email?: string;
  password?: string;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    alert('login correcto');
  }
}

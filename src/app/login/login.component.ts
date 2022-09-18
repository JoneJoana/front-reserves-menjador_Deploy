import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  }
  username?: string;
  password?: string;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    alert('login correcto');
  }

}

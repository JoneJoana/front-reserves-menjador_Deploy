import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROL, TOKEN, USER, USERNAME } from '../Constants';
import { AuthService } from '../_services/auth.service'

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


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(window.sessionStorage.getItem(TOKEN))
      this.router.navigate(['/home']);

  }

  onSubmit(): void{
    console.log("LOGIN")
    this.authService.login(this.form.username, this.form.password)
      .subscribe(
        response => {

          window.sessionStorage.setItem(TOKEN, response.token);
          window.sessionStorage.setItem(USERNAME, this.form.username);
          console.log(window.sessionStorage.getItem(TOKEN))
          console.log(window.sessionStorage.getItem(USERNAME))
          this.getRol();
        },
        error => {
          // gestionar error
          console.log(error)
        });
  }

  getRol() {
    this.authService.getUser(this.form.username)
    .subscribe(
      response => {
        console.log(response.rol.name)
        window.sessionStorage.setItem(ROL, response.rol.name);
        window.location.reload()
      },
      error => {
        console.log(error.message);
      }
    );
  }

}


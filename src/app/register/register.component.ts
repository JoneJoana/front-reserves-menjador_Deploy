import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
declare var swal: any;

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
  email?: any;
  password?: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    console.log("REGISTER")

    this.authService.register(this.form.username, this.form.password, this.form.email)
      .subscribe(
        response => {
        console.log(response)
        swal({
          text: "Login correcto",
          icon: "success",
          button: false,
          timer: 1000
        });
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error)
        swal({
          text: "Login incorrecto",
          icon: "error"
        });
      });

  }
}

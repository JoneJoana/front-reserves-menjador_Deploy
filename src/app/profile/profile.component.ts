import { Component, OnInit } from '@angular/core';
import { USERNAME } from '../Constants';
import { AuthService } from '../_services/auth.service';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  users: any;
  user={
    username: '',
    email: '',
    password: ''
  }

  constructor(private api: AuthService) { }

  ngOnInit(): void {
    this.loadUser(window.sessionStorage.getItem(USERNAME));
  }

  loadUser(username: any) {
    this.api.getUser(username).subscribe(
      (response) => {
        this.user = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );
  }

  updateInfo(){

    this.api.updateUser(window.sessionStorage.getItem(USERNAME)!, {email: this.user.email}).subscribe(
      response => {
        swal({
          text: "Datos actualizados! :)",
          icon: "success",
          button: false,
          timer: 1500
        });
      },
      error => {
        swal({
          text: "Error desconocido :(",
          icon: "error",
          button: false,
          timer: 1500
        });
      }
    )


  }

}

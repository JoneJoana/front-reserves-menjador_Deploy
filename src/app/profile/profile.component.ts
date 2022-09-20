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
    username: 'Cliente1',
    email: 'example@gmail.com',
    password: 'password123'
  }

  constructor(private api: AuthService) { }

  ngOnInit(): void {
    //this.loadUser(window.sessionStorage.getItem(USERNAME));
  }

  loadUser(username: string) {
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
    swal({
      text: "Datos actualizados! :)",
      icon: "success",
      button: false,
      timer: 1500
    });
  }

}

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
    password: '',
    image: null
  }

  selectedFile: File | null = null;
  hasBeenModified = false;


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

  changeImage() {
    $("#user").find(".uploadFile").trigger("click")
    this.hasBeenModified = true;
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
        if(this.hasBeenModified && this.selectedFile != null) {
          this.updateUserImage(this.user.username,this.selectedFile)
          setTimeout (() => {
            window.location.reload();
          }, 1800);
        }
      },
      error => {
        swal({
          text: "Error al modificar los datos. Lo sentimos, intentalo de nuevo :(",
          icon: "error",
          button: false,
          timer: 1500
        });
      }
    )
  }

  updateUserImage(username:string,f:any) {
    this.api.updateUserImage(username,f).subscribe(
      (response) => {
        console.log('updatedishImage correcto');
        console.log(response);
      },
      (error) => {
        console.log('ERROR REQUEST' + error.message);
      }
    );
    this.selectedFile = null;
}

  onFileChanged(event:any) {
    console.log("onFileChanged")
    this.selectedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e : any) {
        console.log($("#user").find(".preview").attr("src"))
          $("#user").find(".preview").attr('src', e.target.result);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USERNAME } from '../Constants';
import { AuthService } from '../_services/auth.service';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user={
    username: this._route.snapshot.paramMap.get('username')!,
    email: '',
    password: '',
    image: null
  }

  newPass={
    oldPassword: "",
    newPassword: "",
    newPasswordRepeat: ""
  }

  selectedFile: File | null = null;
  hasBeenModified = false;


  constructor(private api: AuthService,private _route: ActivatedRoute) { }

  ngOnInit(): void {
    //this.loadUser(window.sessionStorage.getItem(USERNAME));
    this.loadUser(this.user.username);
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
    // CANVIAR CONTRASENYA
    if(this.newPass.newPassword != "") {
      //TODO: Validar contrasenya amb regular expression + popus confirmacio i error/exit
      if(this.newPass.newPassword != this.newPass.newPasswordRepeat) {
        swal({
          text: "La contraseña nueva no coincide",
          icon: "error",
          button: false,
          timer: 2000
        });
        return
      }
      const data = {
        username: this.user.username,
        password: this.newPass.newPassword
      }
      this.api.changePassword(data).subscribe(
        response => {
          swal({
            text: "Contraseña actualizada! :)",
            icon: "success",
            button: false,
            timer: 1500
          });
        },
        error => {
          swal({
            text: "Missatge error change password",
            icon: "error",
            button: false,
            timer: 1500
          });
        }
      )
      return
    }

    // UPDATE USER
    this.api.updateUser(this.user.username, {email: this.user.email}).subscribe(
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

  updatePassword() {
    document.getElementById("goBackBtn")!.style.display = "block"
    document.getElementById("infoBasica")!.style.display = "none"
    document.getElementById("changePassword")!.style.display = "block"
  }

  goInicioPerfil() {
    document.getElementById("goBackBtn")!.style.display = "none"
    document.getElementById("infoBasica")!.style.display = "block"
    document.getElementById("changePassword")!.style.display = "none"
  }

}

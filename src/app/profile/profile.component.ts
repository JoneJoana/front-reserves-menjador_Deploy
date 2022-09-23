import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user = {
    username: this._route.snapshot.paramMap.get('username')!,
    email: '',
    password: '',
    image: null,
  };

  newPass = {
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
  };

  selectedFile: File | null = null;
  hasBeenModified = false;

  constructor(private api: AuthService, private _route: ActivatedRoute) {}

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
    $('#user').find('.uploadFile').trigger('click');
    this.hasBeenModified = true;
  }

  updateUser() {
    let regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regexMail.test(this.user.email)) {
      swal({
        text: 'Error al modificar el email, no es correcto',
        icon: 'error',
        button: false,
        timer: 1800,
      });
      return;
    } else {
      // UPDATE USER
      this.api
        .updateUser(this.user.username, { email: this.user.email })
        .subscribe(
          (response) => {
            swal({
              text: 'Datos actualizados! :)',
              icon: 'success',
              button: false,
              timer: 1500,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1300);
            if (this.hasBeenModified && this.selectedFile != null) {
              this.updateUserImage(this.user.username, this.selectedFile);
              setTimeout(() => {
                window.location.reload();
              }, 1800);
            }
          },
          (error) => {
            swal({
              text: 'Error al modificar los datos. Lo sentimos, intentalo de nuevo :(',
              icon: 'error',
              button: false,
              timer: 1500,
            });
          }
        );
    }
  }

  updatePassword() {
    swal({
      text: '¿Seguro que quieres actualizar tu contraseña?',
      icon: 'warning',
      buttons: [true, 'Si'],
    }).then((okay: boolean) => {
      if (okay) {
        let regexNum = /\d/;
        let regexSymbol = /[$-/:-?{-~!"^_`\[\]]/;

        if (this.newPass.newPassword == '' || this.newPass.newPasswordRepeat == '') {
          swal({
            text: 'Hay campos en blanco',
            icon: 'error',
            button: false,
            timer: 1500,
          });
          return;
        }

        const valid =
          regexNum.test(this.newPass.newPassword) &&
          regexSymbol.test(this.newPass.newPassword) && this.newPass.newPassword.length > 6;

        console.log(this.newPass.newPassword);
        console.log(this.newPass.newPasswordRepeat);
        console.log(regexNum.test(this.newPass.newPassword));
        console.log(regexSymbol.test(this.newPass.newPassword));
        console.log(valid);

        if (valid) {
          if (!this.changePassword()) {
            swal({
              text: 'La contraseña nueva y su repetición no coinciden',
              icon: 'error',
              button: false,
              timer: 1800,
            });
          }
        }else{
          swal({
            text: 'Contraseña mínimo 6 caracteres (con un numero y un símbolo)',
            icon: 'error',
            button: false,
            timer: 1500,
          });
          return;
        }
      }
    });
  }

  private changePassword(): boolean {
    // CANVIAR CONTRASENYA
    let ok: boolean;

    if (this.newPass.newPassword != this.newPass.newPasswordRepeat) return ok = false;

    const data = {
      username: this.user.username,
      password: this.newPass.newPassword,
    };
    this.api.changePassword(data).subscribe(
      (response) => {
        swal({
          text: 'Contraseña actualizada! :)',
          icon: 'success',
          button: false,
          timer: 1500,
        });
        setTimeout (() => {
          window.location.reload();
        }, 1800);
        return ok = true;
      },
      (error) => {
        swal({
          text: 'Error cambiando password',
          icon: 'error',
          button: false,
          timer: 1500,
        });
        return ok = false;
      }
    );
      return ok = true;
  }

  updateUserImage(username: string, f: any) {
    this.api.updateUserImage(username, f).subscribe(
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

  onFileChanged(event: any) {
    console.log('onFileChanged');
    this.selectedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        console.log($('#user').find('.preview').attr('src'));
        $('#user').find('.preview').attr('src', e.target.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  changeViewToPass() {
    document.getElementById('goBackBtn')!.style.display = 'block';
    document.getElementById('infoBasica')!.style.display = 'none';
    document.getElementById('changePassword')!.style.display = 'block';
  }

  goInicioPerfil() {
    document.getElementById('goBackBtn')!.style.display = 'none';
    document.getElementById('infoBasica')!.style.display = 'block';
    document.getElementById('changePassword')!.style.display = 'none';
    this.newPass.oldPassword = '',
    this.newPass.newPassword = '',
    this.newPass.newPasswordRepeat = ''
  }
}

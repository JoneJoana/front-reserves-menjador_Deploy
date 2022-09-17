import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'frontend-tComo';

  isLogin = true;
  logAdmin = false;

  logout(): void{
    //this.tokenStorageService.signOut();
    this.isLogin = false;
    //this.roles = ''
    //this.router.navigate(['/home']);
  }
}

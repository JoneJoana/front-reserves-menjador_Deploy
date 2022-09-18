import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Dish } from './dishes/dishes.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(HomeComponent) home: any;

  carrito: Dish[] = [];
  message:string = "aa"



  receiveMessage($event: any) {
    this.message = $event
    console.log(this.message)
  }

  title = 'frontend-tComo';

  isLogin = true;
  logAdmin = true;

  logout(): void{
    //this.tokenStorageService.signOut();
    this.isLogin = false;
    //this.roles = ''
    //this.router.navigate(['/home']);
  }


}

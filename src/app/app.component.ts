import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ROL, ROL_ADMIN, ROL_CLIENT, TOKEN } from './Constants';
import { Dish } from './dishes/dishes.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild(HomeComponent) home: any;

  constructor( private router: Router) {}

  carrito: Dish[] = [];
  message:string = "aa"

  receiveMessage($event: any) {
    this.message = $event
    console.log(this.message)
  }

  title = 'frontend-tComo';

  isLogin = false;
  logAdmin = false;

  ngOnInit(): void {
    if(window.sessionStorage.getItem(TOKEN)){
      this.isLogin = true
      if(window.sessionStorage.getItem(ROL) == ROL_ADMIN){
        this.logAdmin = true
      }
    }

  }

  logout(): void{
    window.sessionStorage.clear()
    this.isLogin = false;
    this.logAdmin = false;
    this.router.navigate(['/login']);
  }


}

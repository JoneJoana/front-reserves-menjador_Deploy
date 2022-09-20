import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROL, ROL_ADMIN, ROL_CLIENT, TOKEN } from './Constants';
import { Dish } from './dishes/dishes.component';
import { HomeComponent } from './home/home.component';
import { OrdersService } from './_services/api.service';
declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild(HomeComponent) home: any;

  constructor(private router: Router, private ordService: OrdersService,) {}

  carrito: Dish[] = [];
  title = 'frontend-tComo';

  isLogin = false;
  logAdmin = false;

  ngOnInit(): void {
    if(window.sessionStorage.getItem(TOKEN)){
      console.log("logged in")
      this.isLogin = true
      if(window.sessionStorage.getItem(ROL) == ROL_ADMIN){
        console.log("isAdmin")
        this.logAdmin = true
      }
    }

    // Ens subscribim al Subject
    this.ordService.addCarrito.subscribe(
      // Aquest codi s'executara quan s'afegeixi un dish desde home
      dish => {
        this.ordService.carrito.push(dish);
        this.carrito = this.ordService.carrito;
    })

    window.addEventListener('scroll', this.scrollFunction, true);
  }

  logout(): void{
    window.sessionStorage.clear()
    this.isLogin = false;
    this.logAdmin = false;
    this.router.navigate(['/home']);
  }

  showMessageNotLogin(){
    swal({
      text: "Logueate para poder reservar :)",
      buttons: false,
      icon: "info",
      timer:1500
    });
  }




// When the user scrolls down 20px from the top of the document, show the button
scrollFunction() {
  var mybutton:any=document.getElementById('myBtn')
  if (
    document.body.scrollTop > 1100 ||
    document.documentElement.scrollTop > 1100
  ) {
   mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
    console.log("funciona")
  }
}
// When the user clicks on the button, scroll to the top of the document
backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


}

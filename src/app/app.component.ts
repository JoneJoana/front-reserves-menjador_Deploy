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
  dataEntrega: string = new Date().toISOString();

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
  }

  logout(): void{
    window.sessionStorage.clear()
    this.isLogin = false;
    this.logAdmin = false;
    this.router.navigate(['/home']);
  }

  dateInput(tipus:string, accio:string) {
    var d = new Date(this.dataEntrega)
    if(tipus == "dd"){
      if(accio == "+"){
       d.setDate(d.getDate()+1)
      } else {
        d.setDate(d.getDate()-1)
      }
    } else if(tipus == "hh"){
      if(accio == "+"){
        //this.dataEntrega.setHours(this.dataEntrega.getHours()+1)
      } else {
        //this.dataEntrega.setHours(this.dataEntrega.getHours()+1)
      }
    } if(tipus == "mm"){
      if(accio == "+"){
        //this.dataEntrega.setHours(this.dataEntrega.getHours()+1)
      } else {
        //this.dataEntrega.setHours(this.dataEntrega.getHours()+1)
      }
    }
    this.dataEntrega = d.toISOString()
    console.log(this.dataEntrega)
  }

  showMessageNotLogin(){
    swal({
      text: "Logueate para poder reservar :)",
      buttons: false,
      icon: "info",
      timer:1500
    });
  }


}

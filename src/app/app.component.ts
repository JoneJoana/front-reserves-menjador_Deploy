import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MARGIN, MAX_HOUR, MIN_HOUR, ROL, ROL_ADMIN, TOKEN, USERNAME } from './Constants';
import { Dish } from './dishes/dishes.component';
import { OrdersService } from './_services/api.service';
declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private router: Router, private ordService: OrdersService,) {}

  carrito: Dish[] = [];
  dataEntrega: string = "";

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

    // Listener scroll per mostrar o treure boto scroll top
    window.addEventListener('scroll', this.scrollFunction, true);

    this.setDefaultDeliveryDate();
  }

  logout(): void{
    window.sessionStorage.clear()
    this.isLogin = false;
    this.logAdmin = false;
    this.router.navigate(['/home']);
  }

  dateInput(tipus:string, accio:string) {
    var d:Date = new Date(this.dataEntrega)
    if (tipus == "hh") {
      // Compensar offset per fer els calculs
      var hh = d.getHours()

    	if(accio == "-") {
        if(hh-1 < MIN_HOUR) return;
        d.setHours(d.getHours()-1)
      } else{
        if(hh+1 > MAX_HOUR) return;
        d.setHours(d.getHours()+1)
        if(hh+1==15) d.setMinutes(0)
      }
    } else if(tipus == "mm") {
      var mm = d.getMinutes()
      if(d.getHours() == 15) return
      if(accio == "-"){
        if(mm == 0) return;
        mm == 15 ? mm = 0 : mm-=15
      } else{
        if(mm == 45) return;
        mm == 45 ? mm = 0 : mm+=15
      }
      d.setMinutes(mm)
    } else {
      if(accio == "-"){
        /*
        The getDay() method returns the day of the week (0 to 6) of a date.
        Sunday = 0, Monday = 1, ...
        */
        // Controlar dies anteriors a avui
        if(d.getDay()-1 < new Date().getDay()) return

        d.setDate(d.getDate()-1)
      } else{
        d.setDate(d.getDate()+1)
      }
      // Controlar caps de setmana 6=Dissabte 0=Diumenge
      if(d.getDay() == 6) d.setDate(d.getDate()-1)
      if(d.getDay() == 0) d.setDate(d.getDate()+1)

    }

    // Controlar hores
    hh = d.getHours()
    mm = d.getMinutes()

    var dNew = new Date(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+hh+":"+mm)
    var dMinim = new Date()
    dMinim.setMinutes(dMinim.getMinutes()+MARGIN)

    if(dNew < dMinim) return

    // Actualitzar data entraga
    this.dataEntrega = d.toISOString();
  }

  showMessageNotLogin(){
    swal({
      text: "Logueate para poder reservar :)",
      buttons: false,
      icon: "info",
      timer:2000
    });
  }

  eliminarPlat(dishID: number) {
    swal({
      text: '¿Estás seguro de querer eliminar este plato?',
      icon: 'warning',
      buttons: [true, "Si"],
    }).then((okay: boolean) => {
      if (okay) {
        this.carrito.forEach((element,index)=>{
          if(element.id==dishID) this.carrito.splice(index,1);
        });
      }else {
        return;
      }
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

  realizarOrden() {
    // Sumar dues hores per compensar l'offset horari quan passem a ISOString
    var d = new Date(this.dataEntrega)
    d.setHours(d.getHours()+2)

    // Preparar llista plats amb nomes id
    var llistaDishes:any = []
    this.carrito.forEach(d => {
      llistaDishes.push({id: d.id})
    })

    // Construir objecte ordre {'deliveryOn': '', 'dishes': llistaPlats, 'user': objecteUser}
    var ordre = {
      deliveryOn: d.toISOString(),
      user: {username: window.sessionStorage.getItem(USERNAME)},
      dishes: llistaDishes
    }

    swal({
      text: '¿Quieres realizar ya tu orden?',
      icon: 'info',
      buttons: [true, "Si"],
    }).then((okay: boolean) => {
      if (okay) {
        // Fer post amb data i plats + usuari
        this.ordService.createOrder(ordre).subscribe(
          response => {
            swal({
              text: "¡Orden creada! :)",
              icon: "success",
              button: false,
              timer: 1700
            });
            setTimeout (() => {
              window.location.reload();
            }, 1800);
          },
          error => {
            swal({
              text: "Fallo al realizar la orden. Lo sentimos, intentalo de nuevo",
              icon: "error",
              timer: 1000
            });
          }
        )
      } else {
        return;
      }
    });
  }

  setDefaultDeliveryDate() {
    // Default date
    if(this.dataEntrega == "") {
      var defaultDate = new Date()
      // Arrodonir hora actual a minuts en quart (00,15,30 o 45) cap amunt
      var minuts = defaultDate.getMinutes()
      if(minuts < 15) minuts = 15
      else if(minuts < 30) minuts = 30
      else if(minuts < 45) minuts = 45
      else if(minuts < 60) { minuts = 0;defaultDate.setHours(defaultDate.getHours()+1)}
      defaultDate.setMinutes(minuts)

      // Si avui ja hem passat de les 14:40, no es pot fer una ordre per avui, perque hi ha un marge de
      // 20 min, no es pot posar data d'entrega passat les 15:00, per tant, es posa la data a demà a les 12:00
      if(defaultDate.getHours() > 14 || (defaultDate.getHours()==14 && defaultDate.getMinutes() > 40)) {
        defaultDate.setDate(defaultDate.getDate()+1)
        defaultDate.setHours(12)
        defaultDate.setMinutes(0)
      }
      this.dataEntrega = defaultDate.toISOString()
    }
  }

}


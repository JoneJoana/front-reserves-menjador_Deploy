import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DishesService, OrdersService } from '../api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit,AfterViewInit {

  admin = false;
  orders:any;
  modifying:any = new Map<number,boolean>()
  platsTmp:any = new Map<number,any>()
  plats:any;

  constructor(private api:OrdersService, private dishes:DishesService, private router: Router) { }

  ngAfterViewInit(): void {
    this.getDishes()
  }

  ngOnInit(): void {
    this.loadOrders()
/* De moment ho deixo comentat, pero poso aixo per que recalculi el temps que queda per modificar
la ordre, i que el bloquegi, si cal. S'executa un cop per minut.
    setInterval(() => {
      // No canviar component, actualitzar nomes llista orders
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders']);
      });
    }, 60000)
    */

  }

  isModifiable(status:any,dd:any): boolean {
    // Minuts permesos per modificar ordre abans d'entrega
    // Si es modifica, cal canviar-ho també a dates.pipe.ts!!!!
    const MARGIN = 20

    // Si la ordre no esta pendent (esta entregada), que no deixi modificar
    if(status != "P") return false;
    //console.log("isModifiable()")

    // Es converteix de string a Date la data d'entrega
    var deliveryDate:any = new Date(dd.split("+")[0]);
    deliveryDate.setMinutes(deliveryDate.getMinutes()-20)
    // Data actual
    var nd:any = new Date()

    // Si ja ens hem passat de la data d'entrega, no es pot modificar
    if(nd > deliveryDate) return false

    // Calcular diferencia en minuts entre les dues dates
    var diff:any = ((nd - deliveryDate)/1000)/60

    return diff < MARGIN;
  }

  loadOrders() {
    var usuariTemp = "Cliente1"
    console.log("loadOrders() "+usuariTemp)

    this.api.gerOrdersByUser(usuariTemp).subscribe(
      response => {
        this.orders = response
      },
      error => {
        console.log("ERROR REQUEST:\n "+error.message)
      }
    )
  }

  onBtnModify(id:any){
    this.modifying.set(id,true)
    this.platsTmp.set(id,this.orders[this.getIndexByOrderId(id)].dishes)
  }

  getDishesByOrderId(id:number) {
    var order:any;
    this.orders.forEach((o:any) => {
      if(o.id == id) order = o
    });
    return order.dishes
  }

  update(id:any){
    console.log(this.orders[this.getIndexByOrderId(id)])
    let segur = confirm("Do you really want to update this order?");
    if(!segur) return
    // fer update
    this.api.updateOrder(this.orders[this.getIndexByOrderId(id)]).subscribe(
      response => {
        alert("Ordre actualitzada correctament")
        this.loadOrders()
      },
      error => {
        alert("ERROR")
        console.log("ERROR REQUEST:\n "+error.message)
      }
    )
    // recarregar llista
    this.platsTmp.delete(id)
    this.modifying.delete(id)
  }

  getIndexByOrderId(id:any) {
    var index:any;
    this.orders.forEach((o:any , i:number) => {
      if(o.id == id) index = i
    });
    return index
  }

  cancelModification(id:any){
    this.orders[this.getIndexByOrderId(id)].dishes = this.platsTmp.get(id)
    this.platsTmp.delete(id)
    this.modifying.delete(id)
  }

  eliminarPlat(idOrdre:number,idPlat:number) {
    var llista = new Array()
    this.orders[this.getIndexByOrderId(idOrdre)].dishes.forEach((d:any) => {
      if(d.id != idPlat) {
        llista.push(d)
      }
    });
    this.orders[this.getIndexByOrderId(idOrdre)].dishes = llista
  }


  eliminar(id:any){
    let segur = confirm("Do you really want to delete this order?");
    if(!segur) return
    this.api.deleteOrder(id).subscribe(
      response => {
        alert("Ordre eliminada correctament")
        this.loadOrders()
      },
      error => {
        alert("ERROR")
        console.log("ERROR REQUEST:\n "+error.message)
      }
    )
  }

  getDishes() {
    this.dishes.getDishes().subscribe(
      response => {
        this.plats = response
      },
      error => {
        console.log("ERROR REQUEST:\n "+error.message)
      }
    )
  }

  onSelectPlato(idOrdre:any, e:any) {
    // Index del plat seleccionat
    var i:number = e.target.value

    // Comprovar si existeix plat a la llista de plats de la ordre
    var exists:boolean = false
    this.orders[this.getIndexByOrderId(idOrdre)].dishes.forEach((d:any) => {
      if(d.id == this.plats[i].id) {
        exists = true
      }
    });

    // Si no existeix, afegir-lo
    if(!exists) {
      this.orders[this.getIndexByOrderId(idOrdre)].dishes.push(this.plats[i])
    }

    // Reset de la opcio seleccionada per defecte
    e.target.selectedIndex = 0
  }

  dateInput(tipus:string, accio:string, event:any, iOrd:any) {
    var input = event.target.closest("div.wrapper-dateinput").firstChild
    if (tipus == "hh") {
    	if(accio == "-") {
        input.stepDown()
      } else{
        input.stepUp()
      }
      //this.orders[iOrd].deliveryOn = this.orders[iOrd].deliveryOn.replace(/T\d\d:/,input.value);
      console.log(this.orders[iOrd].deliveryOn.replace(/T\d\d:/,"T"+input.value+":"));
    } else if(tipus == "mm") {
      if(accio == "-"){
        if(input.value == "00") return;
        input.value == 15 ? input.value = "00" : input.stepDown(15)
      } else{
        input.value == 45 ? input.value = "00" : input.stepUp(15)
      }
    } else {
      var dies = [ "Mon.", "Tue.", "Wed.", "Thu.", "Fri."];
      if(accio == "-"){
        var i = dies.indexOf(input.value)
        if(i<0 || i>4) return;
        console.log(i, dies[i-1])
        event.target.closest("div.wrapper-dateinput").firstChild.value == dies[i-1]
      } else{

        var i = dies.indexOf(input.value)
        if(i<0 || i>4) return;
        console.log(i, dies[i+1])
        event.target.closest("div.wrapper-dateinput").firstChild.value == dies[i+1]
      }
    }

    console.log(input.value)
  }

  onModelChange(e:any,o:any) {
    console.log(e.target.value)
    console.log(o)
  }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit,AfterViewInit {

  admin = false;
  orders:any;
  retrievedImage: any;
  // idOrdre, array idPlats
  plats:any = new Map<number,Array<number>>()

  constructor(private api:OrdersService, private router: Router) { }

  ngAfterViewInit(): void {

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
    console.log("isModifiable()")

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
    this.plats.set(id,this.getDishesByOrderId(id))
    console.log(this.plats.get(id))
  }

  getDishesByOrderId(id:number) {
    var order:any;
    this.orders.forEach((o:any) => {
      if(o.id == id) order = o
    });
    return order.dishes
  }

  update(id:any){
    // fer update
    this.orders[this.getIndexByOrderId(id)].dishes = this.plats.get(id)
    //console.log(this.orders[this.getIndexByOrderId(id)].id)
    // recarregar llista
    this.plats.delete(id)
  }

  getIndexByOrderId(id:any) {
    var index:any;
    this.orders.forEach((o:any , i:number) => {
      if(o.id == id) index = i
    });
    return index
  }

  cancelModification(id:any){
    // netejar
    this.plats.delete(id)
  }

  eliminarPlat(idOrdre:number,idPlat:number) {
    var llista:Array<number> = [];
    this.plats.get(idOrdre).forEach((d:any) => {
      if(d.id != idPlat) llista.push(d)
    });
    this.plats.set(idOrdre,llista)
    console.log(this.plats.get(idOrdre))
  }


  eliminar(id:any){
    console.log("eliminar")
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

}

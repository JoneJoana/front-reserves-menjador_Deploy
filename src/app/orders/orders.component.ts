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
  modifying:any = new Map()

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
    this.modifying.set(id,true)
  }

  update(id:any){
    // fer update
    // recarregar llista
    this.modifying.set(id,false)
  }

  cancelModification(id:any){
    // netejar
    this.modifying.set(id,false)
  }

  eliminarPlat(idOrdre:number,idPlat:number,e:any) {
    if(e.target.style.textDecoration == "line-through")
      e.target.style.textDecoration = ""
    else
      e.target.style.textDecoration = "line-through"
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

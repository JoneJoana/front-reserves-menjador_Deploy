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

  constructor(private api:OrdersService, private router: Router) { }

  ngAfterViewInit(): void {
    console.log("viewinit")
  }


  ngOnInit(): void {
    this.loadOrders()
/* De moment ho deixo comentat, pero poso aixo per que recalculi el temps que queda per modificar
la ordre, i que el bloquegi, si cal. S'executa un cop per minut.
    setInterval(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders']);
      });
    }, 60000)
    */
  }

  isModifiable(id:any): boolean {
    // Minuts permesos per modificar ordre abans d'entrega
    // Si es modifica, cal canviar-ho també a dates.pipe.ts!!!!
    const MARGIN = 20

    var d:any = document.getElementById("modifyDate"+id)?.innerHTML
    // Hora i minuts data entrega
    var hDel = Number.parseInt(d.split(":")[0])
    var mDel = Number.parseInt(d.split(":")[1])
    // Hora i minuts actuals
    var hAct = new Date().getHours();
    var mAct = new Date().getMinutes();

    // Validacions
    if(hAct > hDel) return false;
    if(hAct == hDel && mAct >= mDel) return false;
    if(hAct <= hDel && Math.abs(mAct-mDel) < 20) return false;

    return true;
  }

  loadOrders() {
    this.api.gerOrders().subscribe(
      response => {
        this.orders = response
        if(this.orders == null) console.log("undef")
        //this.retrievedImage = ;
      }
    )
  }

  loadImage() {
    console.log("ok")
    /*
    var img:HTMLImageElement|any = document.getElementById("imatge"+o.id)
    img.src("data:image/jpeg;base64,"+ o.dishes[0].image)
    */
  }

}



import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  admin = false;
  orders:any = [];

  constructor(private api:OrdersService, private router: Router) { }


  ngOnInit(): void {
    this.loadOrders()

    setInterval(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders']);
      });
    }, 60000)
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
    console.log("NOPE")
    return true;
  }

  loadOrders() {
    this.api.gerOrders().subscribe(
      response => {
        this.orders = response
      }
    )
}


}



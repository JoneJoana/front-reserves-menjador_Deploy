import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { DishesService, OrdersService } from '../_services/api.service';
import { MARGIN, MAX_HOUR, MIN_HOUR, ROL, ROL_ADMIN, USER, USERNAME } from '../Constants';
declare var swal: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  admin = false;
  orders: any = null;
  modifying: any = new Map<number, boolean>();
  plats: any;
  queryOrdenar:string = ""

  filterOrder = '';

  constructor(
    private api: OrdersService,
    private dishes: DishesService,
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (window.sessionStorage.getItem(ROL) == ROL_ADMIN) this.admin = true;

    this.loadOrders();
    this.getDishes();
  }

  isModifiable(status: any, dd: any): boolean {
    // Si la ordre no esta pendent (esta entregada), que no deixi modificar
    if (status != 'P') return false;
    //console.log("isModifiable()")

    // Es converteix de string a Date la data d'entrega
    var deliveryDate: any = new Date(dd.split('+')[0]);
    deliveryDate.setMinutes(deliveryDate.getMinutes() - 20);
    // Data actual
    var nd: any = new Date();

    // Si ja ens hem passat de la data d'entrega, no es pot modificar
    if (nd > deliveryDate) return false;

    // Calcular diferencia en minuts entre les dues dates
    var diff: any = (nd - deliveryDate) / 1000 / 60;

    return diff < MARGIN;
  }

  loadOrders(){
    if(this.admin)
      this.loadOrdersAdmin();
    else
      this.loadOrdersUser(window.sessionStorage.getItem(USERNAME));
  }

  loadOrdersUser(user:any) {
    this.api.gerOrdersByUser(user).subscribe(
      (response) => {
        this.orders = response;
      },
      (error) => {
        console.log('[ERROR] loadOrders()\n ' + error.message);
      }
    );
  }

  loadOrdersAdmin() {
    this.api.gerOrders().subscribe(
      (response) => {
        this.orders = response;

        // Ordenar llista per estat ordre -> Pending > Canceled > Delivered
        this.orders.sort((a: { delivered: string; }, b: { delivered: string; }) => {
          if (b.delivered == "P" && a.delivered != "P") {
            return 1;
          } else if (a.delivered == "P" && b.delivered != "P") {
            return -1;
          } else {
            if (b.delivered == "C" && a.delivered != "C") {
              return 1;
            } else if (a.delivered == "C" && b.delivered != "C") {
              return -1;
            } else {
              return 0
            }
          }
        });

      },
      (error) => {
        console.log('[ERROR] loadOrders()\n ' + error.message);
      }
    );
  }

  onBtnModify(i: number, id: any) {
    this.modifying.set(id, {
      deliveryOn: this.orders[i].deliveryOn,
      dishes: this.orders[i].dishes,
    });
  }

  // Obtenir plats d'una ordre
  getDishesByOrderId(id: number) {
    var order: any;
    this.orders.forEach((o: any) => {
      if (o.id == id) order = o;
    });
    return order.dishes;
  }

  update(i: number, id: any) {
    console.log(this.orders[i]);
    swal({
      text: '¿Estás seguro de querer actualizar esta orden?',
      icon: 'warning',
      buttons: [true, "Si"]
    }).then((okay: boolean) => {
      if (okay) {
        // fer update
        this.api.updateOrder(this.orders[i]).subscribe(
          (response) => {
            swal({
              text: '¡Orden actualizada! :)',
              icon: 'success',
              button: false,
              timer: 1400,
            });
            this.loadOrders();
          },
          (error) => {
            swal({
              text: 'Fallo al actualizar la orden. Lo sentimos, intentalo de nuevo',
              icon: 'error',
              button: false,
              timer: 1400,
            });
            console.log('ERROR REQUEST:\n ' + error.message);
          }
        );
        // recarregar llista
        this.modifying.delete(id);
      } else {
        return;
      }
    });
  }

  cancelModification(i: any, id: any) {
    this.orders[i].dishes = this.modifying.get(id).dishes;
    this.orders[i].deliveryOn = this.modifying.get(id).deliveryOn;
    this.modifying.delete(id);
  }

  eliminarPlat(i: number, idPlat: number) {
    if(this.orders[i].dishes.length <= 1) return;
    var llista = new Array();
    this.orders[i].dishes.forEach((d: any) => {
      if (d.id != idPlat) {
        llista.push(d);
      }
    });
    this.orders[i].dishes = llista;
  }

  eliminar(id: any) {
    swal({
      text: '¿Estás seguro de querer eliminar esta orden?',
      icon: 'warning',
      dangerMode: true,
      buttons: [true, "Si"]
    }).then((okay: boolean) => {
      if (okay) {
        this.api.deleteOrder(id).subscribe(
          (response) => {
            swal({
              text: '¡Orden eliminada correctamente! :)',
              icon: 'success',
              button: false,
              timer: 1500,
            });
            this.loadOrders();
          },
          (error) => {
            swal({
              text: 'Fallo al eliminar la orden. Lo sentimos, intentalo de nuevo',
              icon: 'error',
              button: false,
              timer: 1000,
            });
            console.log('ERROR REQUEST:\n ' + error.message);
          }
        );
      } else {
        return;
      }
    });
  }

  getDishes() {
    this.dishes.getDishes().subscribe(
      (response) => {
        this.plats = response;
      },
      (error) => {
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

  onSelectPlato(iOrd: number, e: any) {
    // Index del plat seleccionat
    var iPlato: number = e.target.value;

    // Comprovar si existeix plat a la llista de plats de la ordre
    var exists: boolean = false;
    this.orders[iOrd].dishes.forEach((d: any) => {
      if (d.id == this.plats[iPlato].id) {
        exists = true;
      }
    });

    // Si no existeix, afegir-lo
    if (!exists) {
      this.orders[iOrd].dishes.push(this.plats[iPlato]);
    }

    // Reset de la opcio seleccionada per defecte
    e.target.selectedIndex = 0;
  }

  dateInput(tipus: string, accio: string, iOrd: any) {
    // Guardar data original per recuperar en cas de cancel·lar ordre
    // ToDo...

    // Valors actuals data entrega
    var d: Date = new Date(this.orders[iOrd].deliveryOn);
    if (tipus == 'hh') {
      // Compensar offset per fer els calculs
      var hh = d.getHours() - Math.abs(d.getTimezoneOffset()) / 60;

      if (accio == '-') {
        if (hh - 1 < MIN_HOUR) return;
        d.setHours(d.getHours() - 1);
      } else {
        if (hh + 1 > MAX_HOUR) return;
        d.setHours(d.getHours() + 1);
        if (hh + 1 == 15) d.setMinutes(0);
      }
    } else if (tipus == 'mm') {
      var mm = d.getMinutes();
      if (d.getHours() - Math.abs(d.getTimezoneOffset()) / 60 == 15) return;
      if (accio == '-') {
        if (mm == 0) return;
        mm == 15 ? (mm = 0) : (mm -= 15);
      } else {
        if (mm == 45) return;
        mm == 45 ? (mm = 0) : (mm += 15);
      }
      d.setMinutes(mm);
    } else {
      if (accio == '-') {
        /*
        The getDay() method returns the day of the week (0 to 6) of a date.
        Sunday = 0, Monday = 1, ...
        */
        // Controlar dies anteriors a avui
        if (d.getDay() - 1 < new Date().getDay()) return;

        d.setDate(d.getDate() - 1);
      } else {
        d.setDate(d.getDate() + 1);
      }
      // Controlar caps de setmana 6=Dissabte 0=Diumenge
      if (d.getDay() == 6) d.setDate(d.getDate() - 1);
      if (d.getDay() == 0) d.setDate(d.getDate() + 1);
    }

    // Controlar hores
    hh = d.getHours() - Math.abs(d.getTimezoneOffset()) / 60;
    mm = d.getMinutes();

    var dNew = new Date(
      d.getFullYear() +
        '-' +
        (d.getMonth() + 1) +
        '-' +
        d.getDate() +
        ' ' +
        hh +
        ':' +
        mm
    );
    var dMinim = new Date();
    dMinim.setMinutes(dMinim.getMinutes() + MARGIN);

    if (dNew < dMinim) return;

    // Actualitzar data entraga
    this.orders[iOrd].deliveryOn = d.toISOString();
  }

  cancelarOrdre(id:number) {
    const data = {
      id: id,
      delivered: "C"
    }
    // TODO: Posar alerta segur que vols canviar estat a Cancelat
    this.ordersService.changeStatus(data).subscribe(
      (response) => {
        this.loadOrders()
      },
      (error) => {
        // TODO: Missatge error No s'ha pogut fer el canvi d'estat per algun motiu desconegut
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

  entregarOrdre(id:number) {
    const data = {
      id: id,
      delivered: "D"
    }
    // TODO: Posar alerta segur que vols canviar estat a Entregat
    this.ordersService.changeStatus(data).subscribe(
      (response) => {
        this.loadOrders()
      },
      (error) => {
        // TODO: Missatge error No s'ha pogut fer el canvi d'estat per algun motiu desconegut
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

  ordenar() {
    var query:string = this.queryOrdenar
    // Si hem tret els filtres, que carregui normal
    if(query == "") { this.loadOrders(); return }
    // Aquí s'hauria de construir la query amb uns checkboxes o algo aixi que digui els camps per ordenar
    this.ordersService.ordenar(query).subscribe(
      (response) => {
        this.orders = response
      },
      (error) => {
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

}

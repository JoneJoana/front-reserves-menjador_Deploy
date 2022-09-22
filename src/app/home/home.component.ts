import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as Isotope from 'isotope-layout';
import { CategoriesService, DishesService, OrdersService } from '../_services/api.service';
import { MAIN_CATEGORIES, ROL, ROL_ADMIN, ROL_CLIENT, TOKEN } from '../Constants';
import { Dish } from '../dishes/dishes.component';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  dishes: any;
  categories: any;
  isotope = false;
  buscar: string = '';
  // quick search regex
  qsRegex: any = undefined;
  carrito: any[] = []

  isLogged = false
  isAdmin = false

  constructor(
    private dishService: DishesService,
    private catService: CategoriesService,
    private ordService: OrdersService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLogged = window.sessionStorage.getItem(TOKEN) != null ? true : false
    this.isAdmin = window.sessionStorage.getItem(ROL) == ROL_ADMIN ? true : false
    this.getDishes();
    this.loadCategories();
  }

  alert(){
    swal("Plato añadido a tu carrito!", {
      icon: "success",
      buttons: false,
      timer: 1500,
    });
  }

  getDishes() {
    this.dishService.getDishesByStatus(true).subscribe(
      (response) => {
        this.dishes = response;
      },
      (error) => {
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

  afegirCarrito(d:Dish) {
    // Notifiquem un plat nou al Subject
    this.ordService.addCarrito.next(d)
    this.carrito.push(d)
    console.log(this.carrito)

    var carritoFlotant = document.getElementById('carritoFlotant')
    if(carritoFlotant != null){
      carritoFlotant.style.display = "block";
    }

  }

  loadCategories() {
    this.catService.getCategories().subscribe(
      (response) => {
        this.categories = response;

        // Posar les categories principals al principi i la resta al final
        var mainCat = Array();
        var extraCat = Array();
        this.categories.forEach((c: any) => {
          if (MAIN_CATEGORIES.includes(c.id)) mainCat.push(c);
          else extraCat.push(c);
        });
        this.categories = mainCat.concat(extraCat);
      },
      (error) => {
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
  }

  doIsotopeMagic(e: any) {
    // Actualitzar estil boto actiu
    $('.filters_menu li').removeClass('active');
    $(e.target).addClass('active');

    var iso = new Isotope('.grid', {
      itemSelector: '.all',
      percentPosition: false,
      masonry: {
        columnWidth: '.all',
      },
    });

    // Inicialitzar isotope (nomes es fa un cop)
    if (!this.isotope) {
      this.isotope = true;
      // Inicialitzar

      // Carregar listeners botons
      var filtersElem = document.querySelector('.filters_menu')!;
      filtersElem.addEventListener('click', (event) => {
        // Obtenir element per filtrar
        var filterValue = (event.target as any).getAttribute('id');
        iso.arrange({ filter: filterValue });
      });
    }
    //neteja camp busqueda al clicar una categoria
    this.buscar = '';
  }

  onSearchKeyUp(e: any) {

    var iso = new Isotope('.grid', {
      itemSelector: '.all',
      layoutMode: 'fitRows',
      filter: function () {
        var nom = $(this).find('.nomPlat').text();
        var valor = e.target.value;
        var qsRegex = new RegExp(valor, 'gi');
        return qsRegex ? nom.match(qsRegex) : true;
      },
    });

    if (this.buscar == '') {
      iso.destroy();
      //this.isotope = false;
    }
  }

  clearIsoCat() {
    $('.filters_menu li')[0].click();
  }

}

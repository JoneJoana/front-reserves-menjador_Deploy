import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as Isotope from 'isotope-layout';
import { CategoriesService, DishesService, OrdersService } from '../_services/api.service';
import { MAIN_CATEGORIES, ROL, ROL_CLIENT } from '../Constants';
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

  afegirCarrito(d:Dish) {
    // Notifiquem un plat nou al Subject
    this.ordService.addCarrito.next(d)
    this.carrito.push(d)
    console.log(this.carrito)
  }

  alert(){
    swal("Plato añadido a tu carrito!", {
      icon: "success",
      buttons: false,
      timer: 1500,
    });
  }

  constructor(
    private dishService: DishesService,
    private catService: CategoriesService,
    private ordService: OrdersService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDishes();
    this.loadCategories();
  }

  getDishes() {
    this.dishService.getDishes().subscribe(
      (response) => {
        this.dishes = response;
      },
      (error) => {
        console.log('ERROR REQUEST:\n ' + error.message);
      }
    );
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
    // Inicialitzar isotope (nomes es fa un cop)
    if (!this.isotope) {
      this.isotope = true;
      // Inicialitzar
      var iso = new Isotope('.grid', {
        itemSelector: '.all',
        percentPosition: false,
        masonry: {
          columnWidth: '.all',
        },
      });

      // Carregar listeners botons
      var filtersElem = document.querySelector('.filters_menu')!;
      filtersElem.addEventListener('click', (event) => {
        // Obtenir element per filtrar
        var filterValue = (event.target as any).getAttribute('id');
        iso.arrange({ filter: filterValue });
      });
    }

    // Actualitzar estil boto actiu
    $('.filters_menu li').removeClass('active');
    $(e.target).addClass('active');

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

    if (this.buscar == '') iso.destroy();
  }

}

import { Component, OnInit } from '@angular/core';
import * as Isotope from 'isotope-layout';
import { CategoriesService, DishesService } from '../api.service';
import { MAIN_CATEGORIES } from '../Constants';
declare var $: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dishes:any
  categories:any
  isotope = false
  buscar: string = '';

  constructor(private api:DishesService, private api2: CategoriesService,) { }

  ngOnInit(): void {
    this.getDishes()
    this.loadCategories();
  }

  getDishes() {
    this.api.getDishes().subscribe(
      response => {
        this.dishes = response
      },
      error => {
        console.log("ERROR REQUEST:\n "+error.message)
      }
    )
  }

  loadCategories() {
    this.api2.getCategories().subscribe(
      response => {
        this.categories = response;

        // Posar les categories principals al principi i la resta al final
        var mainCat = Array()
        var extraCat = Array()
        this.categories.forEach((c:any) => {
          if(MAIN_CATEGORIES.includes(c.id))
            mainCat.push(c)
          else
            extraCat.push(c)
        });
        this.categories = mainCat.concat(extraCat)

      },
      error => {
        console.log("ERROR REQUEST:\n "+error.message);
      }
    );
  }

  doIsotopeMagic(e:any){

    // Inicialitzar isotope un cop cada vegada que es carrega el component Home
    if(!this.isotope) {
      console.log("ISOTOPE INICIALITZAT")
      this.isotope = true

      // Inicialitzar
      var iso = new Isotope( '.grid', {
        itemSelector: '.all',
        percentPosition: false,
        masonry: {
          columnWidth: ".all"
        }
      });

      // Carregar listeners botons
      var filtersElem = document.querySelector('.filters_menu')!;
      filtersElem.addEventListener( 'click', function( event ) {
        var filterValue = (event.target as any).getAttribute('id');
        iso.arrange({ filter: filterValue });
      });


      var llista = $('.filters_menu li')
      for (let i = 0; i < llista.length; i++) {
        const li = llista[i];
        if(isMainCategory(li.getAttribute("id-cat")))
          li.style.backgroundColor = "#741b47"

      }
    }

    // Actualitzar boto actiu
    $('.filters_menu li').removeClass('active');
    $(e.target).addClass('active');

    this.buscar = '';
  }

}


function isMainCategory(idCat:number):boolean {
  return MAIN_CATEGORIES.includes(+idCat)
}

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
  // quick search regex
  qsRegex:any = undefined;

  constructor(private api:DishesService, private api2: CategoriesService) { }

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
/*
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
      filtersElem.addEventListener( 'click', ( event ) => {
        // Obtenir element per filtrar
        var filterValue = (event.target as any).getAttribute('id');


          iso.arrange({ filter: filterValue });
      });

    }

    // Actualitzar estil boto actiu
    $('.filters_menu li').removeClass('active');
    $(e.target).addClass('active');
    */
  }
/*
  onSearchKeyUp(e:any) {
        // Inicialitzar
        var iso = new Isotope( '.grid', {
          itemSelector: '.all',
          layoutMode: 'fitRows',

        });
    //var qsRegex;
    // Passar filtre buscador
    iso.arrange({ filter: function() {
      var nom = $(this).find('.nomPlat').text();
      var valor = e.target.value
      //new RegExp( $quicksearch.val(), 'gi' );
      //if(nom.includes(valor))
      var qsRegex = new RegExp( valor, 'gi' )
      console.log(qsRegex ? nom.match(qsRegex) : true)
      return qsRegex ? nom.match(qsRegex) : true;
    }});
    //this.qsRegex = new RegExp( this.buscar, 'gi' );
    //$grid.isotope();
  }

*/

  onSearchKeyUp(e:any) {
    var iso = new Isotope( '.grid', {
      itemSelector: '.all',
      layoutMode: 'fitRows',
      filter: function() {
        //console.log(qsRegex ? $(this).text().match( qsRegex ) : true)
        var nom = $(this).find('.nomPlat').text();
        var valor = e.target.value
        var qsRegex = new RegExp( valor, 'gi' )
        console.log("nom: "+nom)
        console.log("valor: "+valor)
        console.log("qsRegex: "+qsRegex)
        console.log(qsRegex ? nom.match(qsRegex) : true)
        console.log("-------------------")
        return qsRegex ? nom.match(qsRegex) : true;
      }
    });

    if(this.buscar=="")iso.destroy()
  }



}

function isMainCategory(idCat:number):boolean {
  return MAIN_CATEGORIES.includes(+idCat)
}




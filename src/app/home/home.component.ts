import { Component, OnInit } from '@angular/core';
import * as Isotope from 'isotope-layout';
import { CategoriesService, DishesService } from '../api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dishes:any
  categories:any
  isotope = false

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
      },
      error => {
        console.log("ERROR REQUEST:\n "+error.message);
      }
    );
  }

  prova(e:any){

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
        console.log(filterValue)
        iso.arrange({ filter: filterValue });
      });
    }

    // Actualitzar boto actiu
    $('.filters_menu li').removeClass('active');
    $(e.target).addClass('active');

  }


}



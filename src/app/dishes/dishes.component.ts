import { NgForOf } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import {
  CategoriesService,
  DishesService,
  OrdersService,
} from '../api.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {

  admin: boolean = true;
  dishes: Dish[] = [];
  categories: Category[] = [];
  retrievedImage: any;
  addDish = false;

  newDish = {
    name: '',
    image: '',
    popularity: 0,
    status: false,
    categories: [],
  };

  visibilityImg: boolean[] = [];
  visibilityFormFile: boolean[] = [];

  constructor(
    private api: DishesService,
    private api2: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.loadCategories();
  }

  //compara les categ del plat amb la llista completa de categ, per tal que surtin checked a la llista
  compare(dish: Dish, category: Category): Category | undefined{
    return dish.categories.find((categoryDish: Category) => categoryDish.id === category.id)
  }

  changeVisibility(indexDish: number) {
    this.visibilityFormFile[indexDish] = true;
    this.visibilityImg[indexDish] = false;
  }

  loadDishes() {
    this.api.getDishes().subscribe(
      (response) => {
        this.dishes = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );

  }

  loadCategories() {
    this.api2.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );
  }


  add() {
    this.addDish = true;
  }

  save() {
    if (this.newDish.name != '') {
      this.api.postDish(this.newDish).subscribe(
        (response) => {
          this.dishes = response;
          this.loadDishes();
          this.clearNewDish();
          this.addDish = false;
          if (response == null) {
            alert('No sha guardat el plat. Nom repetit');
          }
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    } else {
      console.log('El nom esta buit. No sha guardat.');
    }
  }

  cancel() {
    this.addDish = false;
    this.clearNewDish();
  }

  clearNewDish() {
    this.newDish = {
      name: '',
      image: '',
      popularity: 0,
      status: false,
      categories: [],
    };
  }

  delete(id: number) {
    if(confirm('¿Seguro que quieres cambiar el estado a Inactivo?')){
      this.api.deleteDish(id).subscribe(
        (response) => {
          this.loadDishes();
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    }

  }

  update(id: number) {
    var llistaCat: any[] = []
    // Obtenim categories del dish
    var categories:any = $("#dish0").find(".categories").find("div")
    // Iterem sobre cada categoria per comprovar si esta seleccionada
    for (const c of categories) {
      var isChecked = $(c).find("input")[0].checked
      if(isChecked) {
        var idCat = c.getAttribute("cat-id");
        llistaCat.push({id: idCat})
      }
    }

    if(confirm('¿Seguro que quieres modificar los datos de este plato?')){
      this.dishes[id].categories = llistaCat

      this.api.putDish(this.dishes[id]).subscribe(
        (response) => {
          this.dishes = [];
          if(this.dishes.length == 0)
          this.loadDishes();
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
    }
  }
}

export interface Dish {
  id: number;
  name: string;
  image: any;
  popularity: number;
  status: boolean;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
}


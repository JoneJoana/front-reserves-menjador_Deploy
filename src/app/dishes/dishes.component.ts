import { NgForOf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CategoriesService,
  DishesService,
  OrdersService,
} from '../api.service';
//declare var $: any;

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  admin: boolean = true;
  dishes: Dish[] = []; //agafant dades de la bbdd // Dish[] en el cas dutilitzar les dades const dish1 etc
  categories: Category[] = [];
  //categDish: any;
  retrievedImage: any;
  addDish = false;

  compare(dish: Dish, category: Category): Category | undefined{
    return dish.categories.find((categoryDish: Category) => categoryDish.id === category.id)
  }

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

    /*mirar como hacerlo bien
    if(this.dishes === null){
      this.loadDishes();
    }else{
      return this.dishes;
    }
    if(this.categories === null){
      this.loadCategories();
    }else{
      return this.categories;
    } */

    /*
      const dish1 = {
      id: 1,
      name: 'arroz con gambas',
      image: '/assets/images/f1.png',
      popularity: 2,
      status: true,
      categories: ['arroz','primero']
    }
    const dish2 = {
      id: 2,
      name: 'salmon plancha',
      image: '/assets/images/f2.png',
      popularity: 5,
      status: true,
      categories: ['pescado','segundo']
    }
    const dish3 = {
      id: 3,
      name: 'pollo al horno',
      image: '/assets/images/f3.png',
      popularity: 3,
      status: false,
      categories: ['carne','segundo']
    }
    this.dishes.push(dish1);
    this.dishes.push(dish2);
    this.dishes.push(dish3);*/
  }

  changeVisibility(indexDish: number) {
    this.visibilityFormFile[indexDish] = true;
    this.visibilityImg[indexDish] = false;
  }

  loadDishes() {
    this.api.getDishes().subscribe(
      (response) => {
        this.dishes = response;
        console.log(this.dishes);
        //this.retrievedImage = ;
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
        console.log(this.categories);
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
    this.api.deleteDish(id).subscribe(
      (response) => {
        this.loadDishes();
      },
      (error) => {
        console.log('ERROR REQUEST' + error.message);
      }
    );
  }

  update(id: number) {
      this.api.putDish(this.dishes[id]).subscribe(
        (response) => {
          this.loadDishes();
        },
        (error) => {
          console.log('ERROR REQUEST' + error.message);
        }
      );
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

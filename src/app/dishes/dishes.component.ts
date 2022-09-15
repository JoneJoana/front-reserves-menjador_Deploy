import { NgForOf } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  dishes: Dish[] = [];
  categories: Category[] = [];
  retrievedImage: any;
  addDish = false;

  newCategDishChecked: Category[] = [];

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

  //compara les categ del plat amb la llista completa de categ, per tal que surtin checked a la llista
  compare(dish: Dish, category: Category): Category | undefined{
    return dish.categories.find((categoryDish: Category) => categoryDish.id === category.id)
  }

  //guardem al array newCategDishChecked, les noves categories checked per tal dactualitzar al clicar update - falta implementar la crida al endpoint addCategToDish
  updateCheckedOptions(category: Category,event: any){
    if(event.target.checked) {
      this.newCategDishChecked.push(category);
    } else {
      for(var i=0 ; i < this.categories.length; i++) {
        if(this.newCategDishChecked[i].id == category.id) {
          this.newCategDishChecked.splice(i,1);
        }
      }
    }
    console.log("newCat"+this.newCategDishChecked);
  }

  changeVisibility(indexDish: number) {
    this.visibilityFormFile[indexDish] = true;
    this.visibilityImg[indexDish] = false;
  }

  loadDishes() {
    this.api.getDishes().subscribe(
      (response) => {
        this.dishes = response;
        //console.log(this.dishes);
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
        //console.log(this.categories);
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
    if(confirm('¿Seguro que quieres modificar los datos de este plato?')){
      this.dishes[id].categories = this.dishes[id].categories.concat(this.newCategDishChecked)
      console.log(this.dishes[id].categories)
      this.newCategDishChecked = []
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

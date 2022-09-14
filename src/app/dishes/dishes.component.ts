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
  dishes: any; //agafant dades de la bbdd // Dish[] en el cas dutilitzar les dades const dish1 etc
  categories: any;
  ctgName: any;
  retrievedImage: any;
  addDish = false;

  compareJson(ctg:any,dishCtg:any){
    if (JSON.stringify(ctg) == JSON.stringify(dishCtg)) {
      return true;
    }
    return false;
  }


  newDish = {
    name: '',
    image: '',
    popularity: 0,
    status: false,
    categories: [],
  };

  //sabiendo que hay 13 platos
  visibilityImg: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  visibilityFormFile: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  constructor(
    private api: DishesService,
    private api2: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDishes();
    this.loadCategories();
    /* setTimeout(() => {
      $("select").niceSelect()
    },500) */

    /*  const dish1 = {
      name: 'arroz con gambas',
      image: '',
      popularity: 2,
      status: true,
      categories: ['arroz','primero']
    }
    const dish2 = {
      name: 'salmon plancha',
      image: '',
      popularity: 5,
      status: true,
      categories: ['pescado','segundo']
    }
    const dish3 = {
      name: 'pollo al horno',
      image: '',
      popularity: 3,
      status: false,
      categories: ['carne','segundo']
    }
    this.dishes.push(dish1);
    this.dishes.push(dish2);
    this.dishes.push(dish3); */
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
        /* for (let i = 0; i < this.categories.length; i++) {
          console.log(this.categories[i].name);
          this.ctgName.push(this.categories[i].getName());
        } */
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
          //this.retrievedImage = ;
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
        this.dishes = response;
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
  name: string;
  image: any;
  popularity: number;
  status: boolean;
  categories: string[];
}

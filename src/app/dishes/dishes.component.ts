import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DishesService, OrdersService } from '../api.service';
//declare var $: any;


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit  {

  admin: boolean = true;
  dishes: any; //agafant dades de la bbdd // Dish[] en el cas dutilitzar les dades const dish1 etc
  retrievedImage: any;
  addDish = false;

  newDish: Dish = {
    name: '',
    image: '',
    popularity: 0,
    status: false,
    categories: []
  }

  //sabiendo que hay 3 platos
  visibilityImg: boolean[] = [true,true,true,true,true,true,true,true,true,true,true,true,true];
  visibilityFormFile: boolean[] = [false,false,false,false,false,false,false,false,false,false,false,false,false];

  possibleCategories = ['Pescado','carne','arroz','shushi','primero','segundo','postre']


  constructor(private api:DishesService, private router: Router) { }

  ngOnInit(): void {
    this.loadDishes();
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

  changeVisibility(indexDish: number){
    this.visibilityFormFile[indexDish] = true;
    this.visibilityImg[indexDish] = false;

  }

  loadDishes() {
    this.api.getDishes().subscribe(
      response => {
        this.dishes = response
        console.log(this.dishes);
        //this.retrievedImage = ;
      },
      error => {
        console.log("ERROR REQUEST")
      }
    )
  }

  add(){
    this.addDish = true;
  }

  save(){
    if(this.newDish.name != ''){
      this.api.postDish(this.newDish).subscribe(
        response => {
          this.dishes = response
          //this.retrievedImage = ;
          this.loadDishes();
          this.clearNewDish();
          this.addDish = false;
          if(response==null){
            alert('No sha guardat el plat. Nom repetit');
          }
        },
        error => {
          console.log("ERROR REQUEST" + error.message)
        }
      )
    }else{
      console.log("El nom esta buit. No sha guardat.")
    }

  }

  cancel(){
    this.addDish = false;
    this.clearNewDish();
  }

  clearNewDish(){
    this.newDish = {
      name: '',
      image: '',
      popularity: 0,
      status: false,
      categories: []
    }
  }

  delete(id: number){
    this.api.deleteDish(id).subscribe(
      response => {
        this.dishes = response
        //this.retrievedImage = ;
        console.log(response + 'hola')
        this.loadDishes();
      },
      error => {
        console.log("ERROR REQUEST" + error.message)
      }
    )
  }

  update(dish: any){
    if(dish.name != ''){
      this.api.putDish(dish).subscribe(
        response => {
          this.dishes = response
          //this.retrievedImage = ;
          this.loadDishes();
          if(response==null){
            alert('No sha guardat el plat. Nom repetit');
          }
        },
        error => {
          console.log("ERROR REQUEST" + error.message)
        }
      )
    }else{
      console.log("El nom esta buit. No sha guardat.")
    }
  }

}

export interface Dish{
  name: string,
  image: any,
  popularity: number,
  status: boolean,
  categories: string[];
}

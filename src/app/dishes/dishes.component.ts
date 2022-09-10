import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DishesService } from '../api.service';
declare var $: any;


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit  {

  admin: boolean = true;
  dishes: any; //Dish[] = [];
  retrievedImage: any;

  constructor(private api:DishesService, private router: Router) { } //private api:DishesService, private router: Router

  ngOnInit(): void {
    this.loadDishes()
    setTimeout(() => {
      $("select").niceSelect()
    }, 500)
  }

  loadDishes() {
    this.api.getDishes().subscribe(
      response => {
        this.dishes = response
        console.log(response)
      },
      error => {
        console.log("ERROR REQUEST")
      }
    )
  }

}

export interface Dish{
  name: string,
  popularity: number,
  status: boolean
}

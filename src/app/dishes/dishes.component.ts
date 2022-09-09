import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {

      $("select").niceSelect()

  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDish'
})
export class SearchDishPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultDish = [];
    for(const dish of value){
      if(dish.name.indexOf(arg) > -1 || dish.descripcion.indexOf(arg) > -1){
        resultDish.push(dish);
      }

    }
    return resultDish;
  }

}

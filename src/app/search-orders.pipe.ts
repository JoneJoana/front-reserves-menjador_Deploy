import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchOrders'
})
export class SearchOrdersPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultOrdre = [];
    if(arg == '') return value
    for(const order of value){
      if((order.delivered.toLowerCase()).indexOf(arg.toLowerCase()) > -1){
        resultOrdre.push(order);
      }
      if(order.user.username.toLowerCase().indexOf(arg.toLowerCase()) > -1 && arg.length>1){
        resultOrdre.push(order);
      }
    }
    return resultOrdre;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchOrders'
})
export class SearchOrdersPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultOrdre = [];
    for(const order of value){
      if((order.delivered).toLowerCase().indexOf(arg.toLowerCase()) > -1 || order.user.username.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultOrdre.push(order);
      }
    }
    return resultOrdre;
  }
}

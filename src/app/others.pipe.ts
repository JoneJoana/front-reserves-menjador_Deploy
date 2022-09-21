import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'others'
})
export class OthersPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args != null){

      switch(args){
        case "color": {
          if(value == 'P') return "yellow"
          if(value == 'C') return "red"
          if(value == 'D') return "green"
          break;
        }
        case "statusOrder": {
          if(value == 'P') return "Pending"
          if(value == 'C') return "Canceled"
          if(value == 'D') return "Delivered"
          break;
        }

      }

    }
    return null;
  }

}

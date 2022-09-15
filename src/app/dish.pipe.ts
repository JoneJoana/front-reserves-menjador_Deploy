import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dish'
})
export class DishPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args != null){

      switch(args){
        case "catString": {
          var classes = ""
          value.forEach((c:any) => {
            classes += c.name + " "
          });
          return classes
        }
      }

    }
    return null;
  }

}

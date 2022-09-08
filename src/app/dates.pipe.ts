import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dates'
})

export class DatesPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    // Minuts permesos per modificar ordre abans d'entrega
    // Si es modifica, cal canviar-ho també a orders.components.ts!!!!
    const MARGIN = 20

    if(args != null){
      var d = value.split(/[- :T.]/) // ['2022', '09', '08', '13', '40', '00', '000+00', '00']
      switch(args){
        case "createdOn": {
          if(this.isToday(d[2], d[1], d[0]))
            return ' today at '+d[3]+":"+d[4]
          else
            return " on " + d[2]+"/"+d[1]+"/"+d[0]+" at "+d[3]+":"+d[4]
        }
        case "deliveryOn": {
          return d[3]+":"+d[4];
        }
        case "modifiableTill": {
          var h = d[3];

          // Restar MARGIN minuts a la hora d'entrega
          // Aquests solució només contempla casos entre 0 i 90 minuts.
          // Si es posa un temps fora d'aquest rang, la solució serà rara
          var m = d[4];
          if((m - MARGIN) < 0) {
            m = 60 - (MARGIN - m)
            h--
          } else if((m - MARGIN) == 0) {
            m = "00"
          } else {
            m = d[4] - MARGIN
          }

          return h+":"+m;
        }
      }
    }
    return null;
  }

  isToday(dia:any, mes:any, any:any) {
    var d = new Date();

    // getDate() per obtenir el dia, getDay() retorna el dia de la setmana...
    // sumar +1 al mes, pq el Gener es 0, no 1 (com seria logic...)
    return d.getDate() == dia && d.getMonth()+1 == mes && d.getFullYear() == any
  }

}

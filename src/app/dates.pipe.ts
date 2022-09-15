import { Pipe, PipeTransform } from '@angular/core';
import { MARGIN } from './Constants';

@Pipe({
  name: 'dates'
})

export class DatesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args != null){
      var d = value.split(/[- :T.]/) // ['2022', '09', '08', '13', '40', '00', '000+00', '00']
      switch(args){
        case "createdOn": {
          if(this.isToday(d[2], d[1], d[0]))
            return ' hoy a las '+d[3]+":"+d[4]
          else if(this.isYesterday(d[2], d[1], d[0]))
            return ' ayer a las '+d[3]+":"+d[4]
          else
            return " el " + d[2]+"/"+d[1]+"/"+d[0]+" a las "+d[3]+":"+d[4]
        }
        case "deliveryOn": {
          const dd = d[3]+":"+d[4]
          if(this.isToday(d[2], d[1], d[0]))
            return ' hoy a las '+dd
          else if(this.isYesterday(d[2], d[1], d[0]))
            return ' ayer a las at '+dd
          else if(this.isTomorrow(d[2], d[1], d[0]))
            return ' mañana a las '+dd
          else
            return " el "+this.getDay(d[2])+" "+this.getMonth(d[1])+" a las "+dd;
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
        case "hh": {
          return d[3]
        }
        case "mm": {
          return d[4]
        }
        case "dd": {
          var dow = new Date()
          dow.setDate(d[2])
          return this.getDayOfWeek(dow.getDay())
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

  isYesterday(dia:any, mes:any, any:any) {
    var d = new Date();
    return d.getDate()-1 == dia && d.getMonth()+1 == mes && d.getFullYear() == any
  }

  isTomorrow(dia:any, mes:any, any:any) {
    var d = new Date();
    return d.getDate()+1 == dia && d.getMonth()+1 == mes && d.getFullYear() == any
  }

  getDay(dia:number): string {
    dia = +dia // Convertir str a number
    var sufix = "º"
    return dia+sufix
  }

  getMonth(dia:number): string {
    dia = +dia // Convertir str a number
    var months = [ "Ene.", "Feb.", "Mar.", "Abr.", "May", "Jun",
           "Jul", "Ago.", "Sept.", "Oct.", "Nov.", "Dic." ];

    return months[--dia];
  }

  getDayOfWeek(dia:number): string {
    dia = +dia // Convertir str a number
    var dies = [ "Dom.", "Lun.", "Mar.", "Mie.", "Jue.", "Vie.", "Sab."];
    return dies[dia];
  }

}

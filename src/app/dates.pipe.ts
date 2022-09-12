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
          else if(this.isYesterday(d[2], d[1], d[0]))
            return ' yesterday at '+d[3]+":"+d[4]
          else
            return " on " + d[2]+"/"+d[1]+"/"+d[0]+" at "+d[3]+":"+d[4]
        }
        case "deliveryOn": {
          const dd = d[3]+":"+d[4]
          if(this.isToday(d[2], d[1], d[0]))
            return ' today at '+dd
          else if(this.isYesterday(d[2], d[1], d[0]))
            return ' yesterday at '+dd
          else if(this.isTomorrow(d[2], d[1], d[0]))
            return ' tomorrow at '+dd
          else
            return " on "+this.getDay(d[2])+" "+this.getDayWeek(d[1])+" at "+dd;
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
        } case "hh": {
          console.log(d[3])
          return d[3]
        } case "mm": {
          console.log(d[4])
          return d[4]
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
    var sufix = "th"
    if(dia == 1 || dia == 21 || dia == 31)
    sufix = "st"
    else if(dia == 2 || dia == 22)
    sufix = "nd"
    else if(dia == 3 || dia == 23)
    sufix = "rd"

    return dia+sufix
  }

  getDayWeek(dia:number): string {
    dia = +dia // Convertir str a number
    var months = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
           "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec." ];

    return months[--dia];
  }

}

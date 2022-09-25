import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUser'
})
export class SearchUserPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg.length < 2) return value;
    const resultUser = [];
    for(const user of value){
      if(user.username.toLowerCase().indexOf(arg.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || user.rol.name.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultUser.push(user);
      }
    }
    return resultUser;
  }

}

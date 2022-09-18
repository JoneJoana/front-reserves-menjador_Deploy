import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_URL='https://tch-db.herokuapp.com/';
const httpOptions = {
  headers: new HttpHeaders({'Content Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient) { }

  login(username:string, password:string): Observable<any>{
    return this.http.post(AUTH_URL + 'login', {
      username,
      password
    }, httpOptions);
  }

  register(username:string, password:string, email:string): Observable<any>{
    return this.http.post(AUTH_URL + 'users/add', {
      username,
      email,
      password
    }, httpOptions);
  }


}

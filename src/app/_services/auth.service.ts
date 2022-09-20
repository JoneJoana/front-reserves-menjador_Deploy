import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_URL='https://tch-db.herokuapp.com/';
//const AUTH_URL = 'http://localhost:8080/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
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
    return this.http.post(AUTH_URL + 'api/users/add', {
      username,
      email,
      password
    }, httpOptions);
  }

  getUser(username:string): Observable<any> {
    return this.http.get(AUTH_URL + "api/users/" + username, httpOptions);
  }

  getUsersAll(): Observable<any> {
    return this.http.get(AUTH_URL + "api/users/", httpOptions);
  }

  updateUser(username:string,email:any): Observable<any> {
    return this.http.put(AUTH_URL + "api/users/update/"+username, email, httpOptions);
  }


}

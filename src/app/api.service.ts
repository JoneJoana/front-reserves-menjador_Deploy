import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://tch-db.herokuapp.com';
const headers = {
  headers: new HttpHeaders(
    { "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjI4MzA5MzMsImlzcyI6ImFkbWluIiwic3ViIjoicHJvdmVzIiwiZXhwIjoxNjYzNjk0OTMzfQ.ZbM6j8BLKNEV0wRZ3NJolByLVqpM-rMx_NnFzPU1Xd6E4aJVUiWnYt6jpDcbCOrOre4Yh9VUvs5rV9CmFKYhAw" })
};

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  gerOrders(): Observable<any> {
    return this.http.get(BASE+"/api/orders", headers);
  }
}

@Injectable({
  providedIn: 'root'
})
 export class DishesService {

  constructor(private http: HttpClient) { }

  getDishes(): Observable<any> {
    return this.http.get(BASE+"/api/dishes", headers);
  }

}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(BASE+"/api/categories", headers);
  }

}


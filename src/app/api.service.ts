import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from './dishes/dishes.component';

const BASE = 'https://tch-db.herokuapp.com';
const headers = {
  headers: new HttpHeaders(
    { "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjE5NjM4NDUsImlzcyI6ImFkbWluIiwic3ViIjoicm9vdCIsImV4cCI6MTY2MjgyNzg0NX0.OuH-CkYfq6WmaBBQkd3w6aWRk77uEp5P5whuCAgyUVzooQmqgIdQlc7M-DoJxBj3seXgdtnoGmWfOkx4eQ7aBQ" })
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

  postDish(newDish: Dish): Observable<any> {
    return this.http.post(BASE+"/api/dishes/add", newDish, headers);
  }

  putDish(dish: Dish): Observable<any> {
    return this.http.put(BASE+"/api/dishes/update", dish, headers);
  }

  deleteDish(id: Number): Observable<any> {
    return this.http.delete(BASE+"/api/dishes/delete/"+id, headers);
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


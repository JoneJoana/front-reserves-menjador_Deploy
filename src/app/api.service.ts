import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from './dishes/dishes.component';

const BASE = 'https://tch-db.herokuapp.com';
const headers = {
  headers: new HttpHeaders(
    { "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjI4MzYxNTAsImlzcyI6ImFkbWluIiwic3ViIjoiQWRtaW4xIiwiZXhwIjoxNjYzNzAwMTUwfQ.o6jqDky5fDdWvY63G9H1F5jV99MPSIHNYwFcygvWscxOt6dI7qIvviS8-SmVy4UsUPdfh8GXCxcnJNtJN0XQuQ" })
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


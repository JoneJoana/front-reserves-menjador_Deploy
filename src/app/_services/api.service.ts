import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Dish } from '../dishes/dishes.component';

const BASE = 'https://tch-db.herokuapp.com';
//const BASE = 'http://localhost:8080';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // Subject per compartir informacio carrito desde diferents components
  addCarrito: Subject<any>;
  carrito: Array<any>;

  constructor(private http: HttpClient) {
    this.addCarrito = new Subject<any>();
    this.carrito = new Array<any>()
  }

  resetCarrito() {
    this.carrito = new Array<any>()
  }

  gerOrders(): Observable<any> {
    return this.http.get(BASE+"/api/orders");
  }

  gerOrdersByUser(user:string): Observable<any> {
    return this.http.get(BASE+"/api/orders/user/"+user);
  }

  deleteOrder(id: any): Observable<any> {
    return this.http.delete(BASE+"/api/orders/delete/"+id);
  }

  updateOrder(order: any): Observable<any> {
    return this.http.put(BASE+"/api/orders/update", order);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(BASE+"/api/orders/add", order);
  }

  changeStatus(order: any): Observable<any> {
    return this.http.put(BASE+"/api/orders/update/status", order);
  }

  ordenar(query: any): Observable<any> {
    return this.http.get(BASE+"/api/orders/sorted"+query);
  }

}

@Injectable({
  providedIn: 'root'
})
 export class DishesService {

  constructor(private http: HttpClient) { }

  getDishes(): Observable<any> {
    return this.http.get(BASE+"/api/dishes");
  }

  postDish(newDish: any): Observable<any> {
    return this.http.post(BASE+"/api/dishes/add", newDish);
  }

  putDish(dish: any): Observable<any> {
    return this.http.put(BASE+"/api/dishes/update", dish);
  }

  updateDishImage(dishID:number,file:File): Observable<any> {
    const form = new FormData
    form.append('file', file, file.name)
    return this.http.post(BASE+"/api/dishes/update/"+dishID, form);
  }

  deleteDish(id: Number): Observable<any> {
    return this.http.delete(BASE+"/api/dishes/delete/"+id);
  }

  getDishesByStatus(status: boolean): Observable<any>{
    return this.http.get(BASE+"/api/dishes/status/"+status);
  }

}


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(BASE+"/api/categories");
  }

}


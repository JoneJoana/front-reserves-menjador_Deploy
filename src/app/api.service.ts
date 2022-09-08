import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://tch-db.herokuapp.com';
const headers = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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

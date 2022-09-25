import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = [];

  filterUser = '';

  page_size: number = 6
  page_number: number = 1
  pageSizeOptions = [6,12,24,48,72,100]

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.auth.getUsersAll().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.log('ERROR REQUEST');
      }
    );
  }

  handlePage(e: PageEvent){
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex+1;
  }

  //dado que si estas en 2a pagina, no te busca de la 1a (al reves si), recargamos
  changePage(){
    if(this.page_number !=1){
      window.location.reload();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = [];

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

}

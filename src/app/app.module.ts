import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DishesComponent } from './dishes/dishes.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';

import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';

import { DatesPipe } from './dates.pipe';
import { DishPipe } from './dish.pipe';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';

import { AuthInterceptor, authInterceptorProviders } from './_helpers/authinterceptor';
import { UsersComponent } from './users/users.component';
import { OthersPipe } from './others.pipe';
import { SearchDishPipe } from './search-dish.pipe';
import { SearchUserPipe } from './search-user.pipe';
import { SearchOrdersPipe } from './search-orders.pipe';
import { PaginatePipe } from './paginate.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    HomeComponent,
    OrdersComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    DatesPipe,
    DishPipe,
    OthersPipe,
    SugerenciasComponent,
    UsersComponent,
    SearchDishPipe,
    SearchUserPipe,
    SearchOrdersPipe,
    PaginatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [authInterceptorProviders,MatPaginatorIntl],
  bootstrap: [AppComponent]
})
export class AppModule { }

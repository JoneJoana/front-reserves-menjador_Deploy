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
    SugerenciasComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

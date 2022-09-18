import { Injectable } from '@angular/core';
import { TOKEN, USERNAME } from '../Constants';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private authService: AuthService) { }

  signOut(): void{
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void{
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.setItem(TOKEN, token);
  }

  public getToken(): string | null{
    return window.sessionStorage.getItem(TOKEN);

  }

  public saveUser(user: any): void{
    window.sessionStorage.removeItem(USERNAME);
    window.sessionStorage.setItem(USERNAME, JSON.stringify(user));
  }

  public getUser (): any{
    const user = window.sessionStorage.getItem(USERNAME);
    if(user){
      return JSON.parse(user);
    }
    return{};
  }
}

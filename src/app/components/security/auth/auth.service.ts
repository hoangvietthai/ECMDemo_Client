import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
@Injectable()
export class AuthService {
  constructor(private jwtHelper: JwtHelperService, @Inject(PLATFORM_ID) private platformId: Object) { }
  public isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('id_token');
      if (token != null) {
        return !this.jwtHelper.isTokenExpired(token);
      }
      else {
        return false;
      }
    }
    else return false;
  }
  //public async ValidateToken(token: string): Promise<any> {
  //  let myHeaders = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
  //  let options = new RequestOptions({ headers: myHeaders });
  //  const response = await this.http.get(myGlobals.baseUrl + '/verifytoken?token=' + token, options).toPromise();
  //  return response.json();
  //}
  public GetUser() {
    
    return JSON.parse(localStorage.getItem('ssuser'));
    
  }
  public GetToken() {
    return localStorage.getItem('id_token');
  }
}




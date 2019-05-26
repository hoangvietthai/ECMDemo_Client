import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import * as myGlobals from '../../app.global';

@Injectable()
export class LoginService {
    constructor(private _http: HttpClient) {
    }
    Login(loginModel: any): Observable<any> {
       let options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
        let body = JSON.stringify(loginModel);
        return this._http.post(myGlobals.baseUrl + '/login', body, options)
            .pipe(map(response=> response));
    }
}

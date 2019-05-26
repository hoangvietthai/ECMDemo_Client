import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class GlobalDocumentService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(data:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/document/search",data)
    .pipe(map((response: any) => response));
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class ContactPersonService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/contactperson")
    .pipe(map((response: any) => response));
  }
  getAllByPartnerId(PartnerId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/contactperson?PartnerId="+PartnerId)
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/contactperson/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/contactperson/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/contactperson/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/contactperson/"+Id)
    .pipe(map((response: any) => response));
  }
}

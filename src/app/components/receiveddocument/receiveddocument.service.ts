import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class ReceivedDocumentService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/receiveddocument")
    .pipe(map((response: any) => response));
  }
  getAllBase(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/receiveddocument/base")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/receiveddocument/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/receiveddocument/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/receiveddocument/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/receiveddocument/"+Id)
    .pipe(map((response: any) => response));
  }
  Register(Id:number): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/receiveddocument/register/"+Id,null)
    .pipe(map((response: any) => response));
  }
}

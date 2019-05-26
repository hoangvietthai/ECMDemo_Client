import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class InternalDocumentService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/internaldocument")
    .pipe(map((response: any) => response));
  }
  getAllInDirectory(DirectoryId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/internaldocument?Directory="+DirectoryId)
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/internaldocument/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/internaldocument/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/internaldocument/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/internaldocument/"+Id)
    .pipe(map((response: any) => response));
  }
  Register(Id:number): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/internaldocument/register/"+Id,null)
    .pipe(map((response: any) => response));
  }
}

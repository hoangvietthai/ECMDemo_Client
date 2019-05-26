import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DocumentConfirmService {
  constructor(private _http: HttpClient) {
  }
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentconfirm")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentconfirm/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentconfirm",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentconfirm/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/documentconfirm/"+Id)
    .pipe(map((response: any) => response));
  }
  GetResponse(UserId:number,ConfirmId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentconfirm/responses?UserId="+UserId+"&ConfirmId="+ConfirmId)
    .pipe(map((response: any) => response));
  }
  GetResponseById(ConfirmId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentconfirm/responses/"+ConfirmId)
    .pipe(map((response: any) => response));
  }
  SendResponse(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentconfirm/responses",model)
    .pipe(map((response: any) => response));
  }
  //
  Finish(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentconfirm/finish/"+Id,model)
    .pipe(map((response: any) => response));
  }
  ReCreate(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentconfirm/recreate/"+Id,model)
    .pipe(map((response: any) => response));
  }
}

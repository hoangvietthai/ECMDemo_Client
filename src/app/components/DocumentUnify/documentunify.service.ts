import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DocumentUnifyService {
  constructor(private _http: HttpClient) {
  }
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentunify")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentunify/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentunify",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentunify/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/documentunify/"+Id)
    .pipe(map((response: any) => response));
  }
  SendResponse(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentunify/responses",model)
    .pipe(map((response: any) => response));
  }
  GetResponse(UnifyId:number,UserId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentunify/responses?UserId="+UserId+'&UnifyId='+UnifyId)
    .pipe(map((response: any) => response));
  }
  GetAllResponses(UnifyId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentunify/"+UnifyId+"/responses")
    .pipe(map((response: any) => response));
  }
  //
  Finish(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentunify/finish/"+Id,model)
    .pipe(map((response: any) => response));
  }
  ReCreate(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentunify/recreate/"+Id,model)
    .pipe(map((response: any) => response));
  }
}

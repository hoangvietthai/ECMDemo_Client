import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DocumentPerformService {
  constructor(private _http: HttpClient) {
  }
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentperform")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentperform/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentperform",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentperform/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/documentperform/"+Id)
    .pipe(map((response: any) => response));
  }
  SendResponse(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentperform/responses",model)
    .pipe(map((response: any) => response));
  }
  GetResponse(PerformId:number,UserId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentperform/responses?UserId="+UserId+'&PerformId='+PerformId)
    .pipe(map((response: any) => response));
  }
  GetAllResponses(PerformId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentperform/"+PerformId+"/responses")
    .pipe(map((response: any) => response));
  }
  //
  Finish(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentperform/finish/"+Id,model)
    .pipe(map((response: any) => response));
  }
  ReCreate(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentperform/recreate/"+Id,model)
    .pipe(map((response: any) => response));
  }
}

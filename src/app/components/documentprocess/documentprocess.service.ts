import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DocumentProcessService {
  constructor(private _http: HttpClient) {
  }
  
  getAllProcess(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentprocess/"+Id+"/all")
    .pipe(map((response: any) => response));
  }
  getById(Id:number,Order:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentprocess/"+Id+"?Order="+Order)
    .pipe(map((response: any) => response));
  }
  Create(model:any[],Id:number,Module:number): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentprocess?DocumentId="+Id+"&ModuleType="+Module,model)
    .pipe(map((response: any) => response));
  }
  CreateAuto(Id:number,Module:number): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/documentprocess/auto?DocumentId="+Id+"&ModuleType="+Module,null)
    .pipe(map((response: any) => response));
  }
  getActive(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentprocess/"+Id+"/active")
    .pipe(map((response: any) => response));
  }
  getNext(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/documentprocess/"+Id+"/next")
    .pipe(map((response: any) => response));
  }
  ChangeStatus(Id:number,OrderIndex:number,DocumentId:number,Status:number): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/documentprocess/"+Id+"?OrderIndex="+OrderIndex+"&DocumentId="+DocumentId+"&Status="+Status,null)
    .pipe(map((response: any) => response));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DocumentCateService {
  constructor(private _http: HttpClient) {
  }
  getAllGroup(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/docgroupcategory")
    .pipe(map((response: any) => response));
  }
  getGroupById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/docgroupcategory/"+Id)
    .pipe(map((response: any) => response));
  }
  getActiveGroup(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/docgroupcategory/active")
    .pipe(map((response: any) => response));
  }
  CreateGroup(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/docgroupcategory",model)
    .pipe(map((response: any) => response));
  }
  getAllInGroup(groupId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/doccategory?groupId="+groupId)
    .pipe(map((response: any) => response));
  }
  UpdateGroup(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/docgroupcategory/"+Id,model)
    .pipe(map((response: any) => response));
  }
  ChangeActiveGroup(Id:number): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/docgroupcategory/active/"+Id,null)
    .pipe(map((response: any) => response));
  }
  DeleteGroup(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/docgroupcategory/"+Id)
    .pipe(map((response: any) => response));
  }
  //
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/doccategory")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/doccategory/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/doccategory/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/doccategory/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/doccategory/"+Id)
    .pipe(map((response: any) => response));
  }
}

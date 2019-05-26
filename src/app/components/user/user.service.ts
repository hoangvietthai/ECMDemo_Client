import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class UserService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user")
    .pipe(map((response: any) => response));
  }
  getAllBase(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user/base")
    .pipe(map((response: any) => response));
  }
  getAllForConfirm(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user/forconfirm")
    .pipe(map((response: any) => response));
  }
  getAllByDepartment(DepartmentId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user?DepartmentId="+DepartmentId)
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user/"+Id)
    .pipe(map((response: any) => response));
  }
  getDetailById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/user/"+Id+"/detail")
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/user/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/user/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/user/"+Id)
    .pipe(map((response: any) => response));
  }
}

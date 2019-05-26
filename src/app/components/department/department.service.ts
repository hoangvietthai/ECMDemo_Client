import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DepartmentService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/department")
    .pipe(map((response: any) => response));
  }
  getAllSub(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/department/"+Id+"/sub")
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/department/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
    return this._http.post(myGlobals.baseUrl + "/department/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/department/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/department/"+Id)
    .pipe(map((response: any) => response));
  }
}

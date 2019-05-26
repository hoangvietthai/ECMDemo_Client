import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class DirectoryService {
  constructor(private _http: HttpClient) {
  }
  
  getAll(): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/directory")
    .pipe(map((response: any) => response));
  }
  getAllByModule(ModuleId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/directory?ModuleId="+ModuleId)
    .pipe(map((response: any) => response));
  }
  getAllNodes(ModuleId:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/directory/nodes/"+ModuleId)
    .pipe(map((response: any) => response));
  }
  getById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/directory/"+Id)
    .pipe(map((response: any) => response));
  }
  Create(model:any): Observable<any> {
   
    return this._http.post(myGlobals.baseUrl + "/directory/",model)
    .pipe(map((response: any) => response));
  }
  Update(Id:number,model:any): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/directory/"+Id,model)
    .pipe(map((response: any) => response));
  }
  Delete(Id:number): Observable<any> {
    return this._http.delete(myGlobals.baseUrl + "/directory/"+Id)
    .pipe(map((response: any) => response));
  }
}

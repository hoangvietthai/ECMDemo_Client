import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as myGlobals from '../../app.global';
@Injectable()
export class HomeService {
  constructor(private _http: HttpClient) {
  }
  
  getAllTaks(): Observable<any> {
    let ctn_user= JSON.parse(localStorage.getItem('ssuser'));
    const headers = new HttpHeaders({'ignoreProgressBar': ''});
    return this._http.get(myGlobals.baseUrl + "/taskmessage?UserId="+ctn_user.UserId,{headers: headers})
    .pipe(map((response: any) => response));
  }
  getTaskById(Id:number): Observable<any> {
    return this._http.get(myGlobals.baseUrl + "/taskmessage/"+Id)
    .pipe(map((response: any) => response));
  }
  checkAsRead(Id:number): Observable<any> {
    return this._http.put(myGlobals.baseUrl + "/taskmessage/"+Id+"?Status=1",null)
    .pipe(map((response: any) => response));
  }
  //
  getPendingTasks(){
    return this._http.get(myGlobals.baseUrl + "/pendingtasks")
    .pipe(map((response: any) => response));
  }
  getPendingTaskDetail(Id:number){
    return this._http.get(myGlobals.baseUrl + "/pendingtasks/"+Id)
    .pipe(map((response: any) => response));
  }
  getExpiredTasks(){
    return this._http.get(myGlobals.baseUrl + "/expiredtasks")
    .pipe(map((response: any) => response));
  }
}

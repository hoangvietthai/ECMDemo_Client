import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe,empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {uploadUrl} from '../../app.global';
@Injectable()
export class UploadService {
  constructor(private _http: HttpClient) {

  }
  GetAllFile(folder: string): Observable<any> {
    return this._http.get(uploadUrl + "/browse&path=" + folder)
      .pipe(
        map((response: any) => response),
        catchError((err, caught) => {
          return empty();
        })
      );
  }
  DeleteFolder(folder: string): Observable<any> {
    return this._http.delete(uploadUrl + "/remove?path=" + folder)
      .pipe(
        map((response: any) => response),
        catchError((err, caught) => {
          return empty();
        })
      );
  }
  UploadFile(folder: string, files: any[]): Observable<any> {
    const formData: FormData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('file_' + i, files[i], files[i].name);
    }

    return this._http.post(uploadUrl + "?folderPath=" + folder, formData)
      .pipe(
        map((response: any) => response),
        catchError((err, caught) => {
          return empty();
        })
      );
  }
}

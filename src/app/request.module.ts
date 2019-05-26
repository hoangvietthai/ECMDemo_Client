import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders,HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorDialogService } from './components/shared/error/dialog/errordialog.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private errorDialogService: ErrorDialogService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    //const authHeader = this.auth.getAuthorizationHeader();
    let tmp = localStorage.getItem('ssuser');
    if (tmp != null) {
      if (req.urlWithParams.search("upload") != -1) {
        return next.handle(req);
      }
      let user = JSON.parse(tmp);
      // Pass on the cloned request instead of the original request.
      const headers = new HttpHeaders({
        'UserId': user.UserId.toString(),
        'Token': localStorage.getItem('id_token'),
        'Content-Type': req.headers.get('Content-Type') == null ? 'application/json' : req.headers.get('Content-Type')
      });
      const cloneReq = req.clone({ headers });
      return next.handle(cloneReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          
            // this.errorDialogService.openDialog(event);
          }
          return event;
        }),
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            let data = {};
            if(error.status==401){
              data = {
                reason: error.error && error ? error.error : '',
                status: error.status
              };
            }
            else{
              data = {
                reason: error && error.message ? error.message : '',
                status: error.status
              };
            }
          
            
            this.errorDialogService.show(data);
       
            return throwError(error);
          }
        }));
    }
    else return next.handle(req);

    //  let options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // Clone the request to add the new header.

  }
}

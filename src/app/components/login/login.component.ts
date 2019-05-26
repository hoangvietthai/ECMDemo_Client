import { Component, ViewEncapsulation } from '@angular/core';
import {  ActivatedRoute,Router} from '@angular/router';
import { LoginService } from './login.service';
@Component({
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    LoginService
  ]
})
export class LoginComponent {
  LoginModel: any;
  error: string;
  isFailed: boolean = false;
  returnUrl: string;
  constructor(private _loginService: LoginService, public router: Router, private route: ActivatedRoute) {
   
   
  }
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  login(event: Event, username: string, password: string) {
    event.preventDefault();
    var usr = {
      UserName: username,
      PassWord: password
    };
    this._loginService.Login(usr)
      .subscribe(
        response => {
          if (response.Status == 1) {
            localStorage.removeItem('id_token');
            localStorage.setItem('id_token', response.Data.Token);
            localStorage.setItem("ssuser", JSON.stringify(response.Data.User));
            if(response.Data.User.UserRole==0){
              window.location.href="/quan-tri";
            }
            else{
              window.location.href = this.returnUrl;
            }
           
          }
          else {
            this.isFailed = true;
            
            if (response.Status == 0) {
              this.error = response.Message;
            }
            else {
              this.error = "Đã xảy ra lỗi. Vui lòng thử lại sau!";
              console.log("Lỗi: " + response.Message);
            }


          }

        },
      error => {
        this.isFailed = true;
          this.error = error.text();
        }
      );
  }
}

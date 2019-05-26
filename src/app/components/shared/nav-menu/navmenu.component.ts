import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'nav-menu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css'],
  providers: [
    ConfirmationService
  ]
})
export class NavMenuComponent implements OnInit {
  user: any;
  constructor(private confirmationService: ConfirmationService,private router: Router ) {


  }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("ssuser"));
  }
  SignOut() {
    this.confirmationService.confirm({
      message: 'Thoát khỏi hệ thống',
      header: 'Xác nhận hành động',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        localStorage.clear();
        this.router.navigate(['login']);
      },
      reject: () => {

      }
    });
   
  }
}

import { Component, ViewEncapsulation,OnInit } from '@angular/core';
@Component({
  selector: 'top-menu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css'],
})
export class TopMenuComponent implements OnInit{
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("ssuser"));
  }
  user: any;
  constructor() {
    
  }
  
}

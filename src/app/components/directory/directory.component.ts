import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem,SelectItem } from 'primeng/api';

@Component({
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.css'],
    providers: [

    ]
})
export class DirectoryComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    constructor(
       
    ) {
    
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục phòng ban' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }

    }

    
}
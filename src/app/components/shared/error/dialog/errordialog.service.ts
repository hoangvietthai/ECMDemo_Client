import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/api';
import { ErrorDialogComponent } from './errordialog.component';
import { Router } from '@angular/router';
@Injectable()
export class ErrorDialogService {

    constructor(public dialogService: DialogService,private router: Router) {}

    show(data:any) {
    
        const ref = this.dialogService.open(ErrorDialogComponent, {
            width: '400px',
            contentStyle: {"max-height": "350px", "overflow": "auto"},
            data:data,
            baseZIndex:9999,
            showHeader:true,
            header:"Đã có lỗi xảy ra"
        });

        ref.onClose.subscribe(result =>{
            if (result) {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['/login'], {
                    skipLocationChange: true
                });
            }
        });
    }
}
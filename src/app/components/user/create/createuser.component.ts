import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { UserCreateModel } from '../user';
import { UserService } from '../user.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import {DepartmentService} from '../../department/department.service';
@Component({
    templateUrl: './createuser.component.html',
    providers: [
        UserService,
        DepartmentService
    ]
})
export class CreateUserComponent implements OnInit {
    createModel: UserCreateModel = {};
    dm_departments:SelectItem[];
    constructor(
        private _service: UserService,
        private _department:DepartmentService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {
        this.config.baseZIndex=9998;
        this.dm_departments=[];
    }
    ngOnInit() {
       this._department.getAll().subscribe(res=>{
        for (let i = 0; i < res.Data.length; i++) {
            this.dm_departments.push({
                value: res.Data[i].DepartmentId,
                label: res.Data[i].Name 
            });
        }
       })
        
    }
    save(){
        this._service.Create(this.createModel).subscribe(res=>{
            if(res.Status==1){
                this.ref.close(res);
            }
            else{
                this.ref.close();
            }
        });
        
       
    }
    
}
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { ContactPersonCreateModel,ContactPersonModel } from '../contactperson';
import { ContactPersonService } from '../contactperson.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import {UserService} from '../../user/user.service';
import {BusinessPartnerService} from '../../businesspartner/businesspartner.service';
@Component({
    templateUrl: './createcontactperson.component.html',
    providers: [
        ContactPersonService,
        UserService,
        BusinessPartnerService
    ]
})
export class CreateContactPersonComponent implements OnInit {
    createModel: ContactPersonCreateModel = {};
    users: SelectItem[];
    dm_partners:SelectItem[];
    constructor(
        private _service: ContactPersonService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private _user:UserService,
        private _partner:BusinessPartnerService
    ) {
        this.config.baseZIndex=1004;
        this.users=[];
        this.dm_partners=[];
    }
    ngOnInit() {
       
        this._user.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName + ' (' + res.Data[i].FullName + ')'
                    });
                }
                console.log(this.users);

            }
        });
       this._partner.getAll().subscribe(res => {
        if (res.Status == 1) {
            for (let i = 0; i < res.Data.length; i++) {
                this.dm_partners.push({
                    value: res.Data[i].PartnerId,
                    label: res.Data[i].Name 
                });
            }
            console.log(this.dm_partners);

        }
    });
    }
    save(){
        this._service.Create(this.createModel).subscribe(res=>{
            if(res.Status==1){
                this.ref.close(res.Data);
            }
            else{
                this.ref.close();
            }
        });
        
       
    }
    
}
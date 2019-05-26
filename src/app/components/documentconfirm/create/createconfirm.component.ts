import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DocumentConfirmCreateModel } from '../documentconfirm';
import { DocumentConfirmService } from '../documentconfirm.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import {UserService} from '../../user/user.service';
import { DialogService } from 'primeng/api';
import {SelectUserComponent} from '../../user/selectuser/selectuser.component';
import { Module } from '../../home/taskmessage';
import {DocumentStatusService} from '../../documentstatus/documentstatus.service';
import {DocumentStatusUpdateModel, StatusType,DocumentStatusModel} from '../../documentstatus/documentstatus';
@Component({
    templateUrl: './createconfirm.component.html',
    providers: [
        DocumentConfirmService,
        MessageService,
        UserService,
        DialogService,
        DocumentStatusService
    ]
})
export class CreateDocConfirmComponent implements OnInit {
    createModel: DocumentConfirmCreateModel = {};
    directories: any[];
    display: boolean = false;
    newGroupName: string;
    dm_users:SelectItem[]=[];
    dm_priories:SelectItem[]=[];
    selectedUser:any;
    selectedUsers:SelectItem[]=[];
    ModuleId:number=Module.SEND;
    current_status:DocumentStatusModel;
    constructor(
        private _service: DocumentConfirmService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public _user:UserService,
        public dialogService: DialogService,
        private _status:DocumentStatusService
    ) {
        this.dm_priories=[];
        this.dm_priories.push({
            value:1,
            label:'Thường'
        });
        this.dm_priories.push({
            value:2,
            label:'Quan trọng thấp'
        });
        this.dm_priories.push({
            value:3,
            label:'Quan trọng cao'
        });
        this.createModel={};
        this.createModel.PriorityLevel=1;
        if (this.config.data) {
            this.current_status=this.config.data.Status;
            this.ModuleId=this.config.data.Module;
            this.createModel.Name = 'Phê duyệt '+this.config.data.Name;
            this.createModel.RelatedDocumentId=this.config.data.Id;
            this.createModel.ProcessId=this.config.data.ProcessId;
        }
    }
    ngOnInit() {
        this._user.getAllForConfirm().subscribe(res => {
            if (res.Status == 1) {

                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName
                    })
                }
                if(this.dm_users.length>0)
                this.createModel.UserId=this.dm_users[0].value;
                this.createModel.FinishedOnDate=new Date();
                this.createModel.FinishedOnDate.setDate(this.createModel.FinishedOnDate.getDate()+3);
            }
        });
    }
    save() {
        this.createModel.ModuleId=this.ModuleId;
        this.createModel.FinishedOnDate.setHours(this.createModel.FinishedOnDate.getHours() + (this.createModel.FinishedOnDate.getTimezoneOffset() / 60))
        this._service.Create(this.createModel).subscribe(res => {
            if(res.Status==1){
                let updateStatusModel:DocumentStatusUpdateModel={
                    UnifyStatus:this.current_status.UnifyStatus,
                    ConfirmStatus:StatusType.INPROCESS,
                    PerformStatus:this.current_status.PerformStatus,
                    RegisterStatus:this.current_status.RegisterStatus,
                    ConfirmRelatedId:res.Data.ConfirmId,
                    PerformRelatedId:this.current_status.PerformRelatedId,
                    RegisterRelatedId:this.current_status.RegisterRelatedId,
                    UnifyRelatedId:this.current_status.UnifyRelatedId,
                    DisplayName:"Đang đợi phê duyệt"
                };

                this._status.Update(this.current_status.Id,updateStatusModel).subscribe(res1=>{
                    if(res1.Status==1){
                        this.ref.close(res);
                    }
                    else{
                        this.ref.close(res);
                    }
                })
                
            }
            else this.ref.close(res);
            
        });
    }
}
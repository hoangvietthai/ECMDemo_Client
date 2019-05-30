import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DocumentPerformCreateModel,DocumentPerformModel,DocumentPerformUpdateModel } from '../documentperform';
import { DocumentPerformService } from '../documentperform.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import {UserService} from '../../user/user.service';
import { DialogService } from 'primeng/api';
import {SelectUserComponent} from '../../user/selectuser/selectuser.component';
import { Module } from '../../home/taskmessage';
import {DocumentStatusService} from '../../documentstatus/documentstatus.service';
import {DocumentStatusUpdateModel, StatusType,DocumentStatusModel} from '../../documentstatus/documentstatus';

@Component({
    templateUrl: './createperform.component.html',
    providers: [
        DocumentPerformService,
        MessageService,
        UserService,
        DialogService,
        DocumentStatusService
    ]
})
export class CreateDocPerformComponent implements OnInit {
    createModel: DocumentPerformCreateModel = {};
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
        private _service: DocumentPerformService,
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
       
    }
    ngOnInit() {
        this._user.getAllBase().subscribe(res => {
            if (res.Status == 1) {

                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName
                    })
                }
                this.createModel.AuthorId= JSON.parse(localStorage.getItem('ssuser')).UserId;
                this.createModel.FinishedOnDate=new Date();
                this.createModel.FinishedOnDate.setDate(this.createModel.FinishedOnDate.getDate()+3);
            }
        });
        if (this.config.data) {
            console.log(this.config.data);
            this.current_status=this.config.data.Status;
            this.ModuleId=this.config.data.Module;
            this.createModel.TaskType=this.config.data.TaskType;
            this.createModel.Name = 'Thống nhất '+this.config.data.Name;
            this.createModel.RelatedDocumentId=this.config.data.Id;
            this.createModel.ProcessId=this.config.data.ProcessId;
        }
       
    }
    save() {
        this.createModel.ModuleId=this.ModuleId;
        this.createModel.FinishedOnDate=new Date(this.createModel.FinishedOnDate.toJSON().replace("Z",""));
        this._service.Create(this.createModel).subscribe(res => {
            if(res.Status==1){
                let updateStatusModel:DocumentStatusUpdateModel={
                    PerformStatus:StatusType.INPROCESS,
                    ConfirmStatus:this.current_status.ConfirmStatus,
                    UnifyStatus:this.current_status.UnifyStatus,
                    RegisterStatus:this.current_status.RegisterStatus,
                    ConfirmRelatedId:this.current_status.ConfirmRelatedId,
                    UnifyRelatedId:this.current_status.UnifyRelatedId,
                    RegisterRelatedId:this.current_status.RegisterRelatedId,
                    PerformRelatedId:res.Data.PerformId,
                    DisplayName:"Đang đợi thực hiện"
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
    close(){
        this.ref.close();
    }
    SelectDate($value:Date){
        let tmp=new Date($value.toJSON());
        console.log(tmp);
        console.log(this.createModel.FinishedOnDate);
    }
    openSelectUser() {
        const ref = this.dialogService.open(SelectUserComponent, {
            header: 'Danh sách tài khoản',
            width: '500px',
            data: this.selectedUser
        });

        ref.onClose.subscribe((item: any) => {
            if (item) {
                this.selectedUser = item;
                console.log(this.selectedUser);
                this.selectedUsers=this.selectedUser.items;
                this.createModel.UserList=this.buidStringList(this.selectedUsers);
                // this.cates = [...this.cates, { value: newCate.CategoryId, label: newCate.Name }];
                // this.selectedCates.push({
                //     value: newCate.CategoryId,
                //     label: newCate.Name
                // })

                //this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thể loại mới: ' + newCate.Name });
            }
        });
    }
    buidStringList(list: any[]) {

        let str = "";
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].value + ',';
        };
        if (list.length > 0) str = str.substr(0, str.lastIndexOf(','));
        return str;
    }
}
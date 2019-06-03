import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DocumentPerformModel, DocumentPerformResponseModel } from '../documentperform';
import { DocumentPerformService } from '../documentperform.service';
import { UserService } from '../../user/user.service';
import { DialogService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SendDocumentService } from '../../senddocument/senddocument.service';
import { ReceivedDocumentService } from '../../receiveddocument/receiveddocument.service';
import { InternalDocumentService } from '../../internaldocument/internaldocument.service';
import { uploadDataUrl } from '../../../app.global';
import { BusinessPartnerService } from '../../businesspartner/businesspartner.service';
import { Module, TaskType } from '../../home/taskmessage';
@Component({
    templateUrl: './detaildocumentperform.component.html',
    providers: [
        DocumentPerformService,
        MessageService,
        UserService,
        DialogService,
        SendDocumentService,
        BusinessPartnerService,
        ReceivedDocumentService,
        InternalDocumentService
    ]
})
export class DetailDocPerformComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    display: boolean = false;
    files_of_doc: any[];
    folder: string;
    crnt_user: any;
    private sub: any;
    Id: number;
    mainModel: DocumentPerformModel;
    documentModel: any;
    uploadDataUrl: string = uploadDataUrl;
    responseModel: DocumentPerformResponseModel = {};
    isShowActions: boolean = false;
    dm_users: SelectItem[];
    dm_partners: SelectItem[];
    InvokeUsers: SelectItem[];
    Author: SelectItem;
    dm_priories:SelectItem[];
    constructor(
        private _service: DocumentPerformService,
        public messageService: MessageService,
        public _user: UserService,
        public dialogService: DialogService,
        private _router: ActivatedRoute,
        private _send: SendDocumentService,
        private _partner: BusinessPartnerService,
        private _receive: ReceivedDocumentService,
        private _internal: InternalDocumentService
    ) {
        this.BreadcrumbItems = [
            { label: 'Thực hiện văn bản', url: '' },
            { label: 'Chi tiết' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
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
        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));
        this.responseModel.UserId = this.crnt_user.UserId;

        this.folder = this.crnt_user.UserId + '/' + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
    }
    ngOnInit() {
        this.sub = this._router.params.subscribe(params => {
            this.Id = params['Id'];
            this._service.getById(this.Id).subscribe(res => {
                if (res.Status == 1) {
                    this.mainModel = res.Data;
                    this.responseModel.DocumentPerformId = this.mainModel.PerformId;
                    this.responseModel.CreatedOnDate = new Date();
                    
                    if (this.mainModel.TaskType == TaskType.PERFORM) {
                        switch (this.mainModel.ModuleId) {
                            case Module.SEND: {
                                this._send.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                    if (doc.Status == 1) {
                                        this.documentModel = doc.Data;
                                        this.documentModel.AttachedFileUrl;
                                        this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    }
                                });
                                break;
                            }
                            case Module.RECEIVE: {
                                this._receive.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                    if (doc.Status == 1) {
                                        this.documentModel = doc.Data;
                                        this.documentModel.ReceiverId = this.documentModel.SenderId;
                                        this.documentModel.AttachedFileUrl;
                                        this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    }
                                });
                                break;
                            }
                            case Module.INTERNAL: {
                                this._internal.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                    if (doc.Status == 1) {
                                        this.documentModel = doc.Data;
                                        this.documentModel.AttachedFileUrl;
                                        this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    }
                                });
                                break;
                            }
                        }
                        
                    }

                    this._user.getAllBase().subscribe(res => {
                        this.dm_users = [];
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.dm_users.push({
                                    label: res.Data[i].UserName,
                                    value: res.Data[i].UserId
                                });
                            }
                            this._partner.getAll().subscribe(res1 => {
                                this.dm_partners = [];
                                if (res1.Status == 1) {
                                    for (let i = 0; i < res1.Data.length; i++) {
                                        this.dm_partners.push({
                                            value: res1.Data[i].PartnerId,
                                            label: res1.Data[i].Name
                                        });
                                    }
                                }
                                this.InvokeUsers = this.GetUsers(this.mainModel.UserList);
                                this.Author = this.dm_users.filter(u => u.value == this.mainModel.CreatedByUserId)[0];
                            })
                        }
                    })


                }
            })
            this._service.GetResponse(this.Id,this.crnt_user.UserId).subscribe(res => {
                if (res.Status == 1) {
                    this.isShowActions = false;
                }
                else if (res.Status == 0) {
                    this.isShowActions = true;
                }
            })
        })
        // this.files_of_doc = this.updateModel.AttachedFileUrl.split(',').filter(n => n);
    }
    save() {
       // console.log(this.responseModel);
        this._service.SendResponse(this.responseModel).subscribe(res=>{
            if(res.Status==1){
                this.messageService.add({ severity: 'info', summary: 'Phản hồi thành công' });
                this.isShowActions=false;
            }
            else{
                this.messageService.add({ severity: 'error', summary: 'Phản hồi không thành công' });
            }
        })
    }
    GetPartnerName(id: number) {
        let tmp = this.dm_partners.filter(p => p.value == id)[0];
        if (tmp) return tmp.label;
        else return '';
    }
    GetUsers(str: string) {
        let list_return: SelectItem[] = [];
        let list_id = str.split(',').filter(s => s);
        for (let i = 0; i < list_id.length; i++) {
            let num_id = parseInt(list_id[i]);
            list_return.push(this.dm_users.filter(u => u.value == num_id)[0]);
        }
        return list_return;
    }
    IsExpired(){
        return (new Date(this.mainModel.FinishedOnDate).getTime()<new Date().getTime());
    }
    GetPriority(Id:number){
      
        let tmp= this.dm_priories.filter(p=>p.value==Id)[0];
        if(tmp) return tmp.label;
        else return '';
    }
    DoPerform() {
        this.responseModel.ResponseStatus = 1;
        this.save();
    }
    DoNotPerform() {
        this.responseModel.ResponseStatus = 0;
        this.save();
    }
}
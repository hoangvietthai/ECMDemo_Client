import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem,MessageService } from 'primeng/api';
import { ReceivedDocumentCreateModel,ReceivedDocumentModel } from '../receiveddocument';
import { ReceivedDocumentService } from '../receiveddocument.service';
import { DocumentCateService } from '../../categories/category.service';
import { UserService } from '../../user/user.service';
import {SecretLevels,DeliveryMethods} from '../../../app.global';
import {BusinessPartnerService} from '../../businesspartner/businesspartner.service';
import {DepartmentService} from '../../department/department.service';
import {ContactPersonService} from '../../contactperson/contactperson.service';
import {DocumentStatusService} from '../../documentstatus/documentstatus.service';
import {DocumentStatusCreateModel,StatusType} from '../../documentstatus/documentstatus';
import {Router} from '@angular/router';
import { UploadService } from '../../upload/upload.service';
import { uploadDataUrl } from '../../../app.global';
@Component({
    templateUrl: './createreceiveddocument.component.html',
    providers: [
        ReceivedDocumentService,
        DocumentCateService,
        UserService,
        BusinessPartnerService,
        DepartmentService,
        ContactPersonService,
        DocumentStatusService,
        UploadService,
        MessageService
    ]
})
export class CreateReceivedDocumentComponent implements OnInit {
    createModel: ReceivedDocumentCreateModel = {};
    directories: any[];
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    dm_cates: SelectItem[] = [];
    dm_delivery_methods:any[];
    dm_secretlevels:any[];
    dm_partners:SelectItem[];
    users: any[];
    departments:SelectItem[];
    dm_contacts: SelectItem[];
    statusDoc:DocumentStatusCreateModel;
    files_selected:any[];
    folder: string;
    crnt_user:any;
    uploadDataUrl: string = uploadDataUrl;
    constructor(
        private _service: ReceivedDocumentService,
        private _cate:DocumentCateService,
        private _user:UserService,
        private _partner:BusinessPartnerService,
        private _department:DepartmentService,
        private _contact:ContactPersonService,
        private _status:DocumentStatusService,
        private router: Router,
        private _upload: UploadService,
        private messageService: MessageService
    ) {
        this.users = [];
        this.dm_cates=[];
        this.departments=[];
        this.dm_partners=[];
        this.dm_delivery_methods=DeliveryMethods;
        this.dm_secretlevels=SecretLevels;
        this.statusDoc = {
            UnifyStatus:StatusType.NOTSET,
            ConfirmStatus:StatusType.NOTSET,
            PerformStatus:StatusType.NOTSET,
            RegisterStatus:StatusType.NOTSET,
            DisplayName:'Dự Thảo'
        };
        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));
        this.folder = this.crnt_user.UserId + '/' + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Văn bản đi', url: '' },
            { label: 'Tạo mới' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        //
        this._cate.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_cates.push({ value: res.Data[i].CategoryId, label: res.Data[i].Name });
                }
            }
        });
       
        this._user.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName + ' (' + res.Data[i].FullName + ')'
                    });
                }

            }
        });
        //
        this._partner.getAll().subscribe(res=>{
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_partners.push({
                        value: res.Data[i].PartnerId,
                        label: res.Data[i].Name
                    });
                }
            }
        })
        //
        this._department.getAll().subscribe(res=>{
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.departments.push({
                        value: res.Data[i].DepartmentId,
                        label: res.Data[i].Name
                    });
                }
            }
        })
    }   
    OnPartnerChange(event:any){
        this.dm_contacts=[];
        let selectedPartnerId=event.value;
        this._contact.getAllByPartnerId(selectedPartnerId).subscribe(res=>{
            if(res.Status==1){
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_contacts.push({
                        value: res.Data[i].ContactPersonId,
                        label: res.Data[i].Name
                    });
                }
                if(this.dm_contacts.length>0) this.createModel.SignedByUserId=this.dm_contacts[0].value;
               
            }
        })
    }
    OnSelectFile(event, file_input) {
        this.files_selected = file_input.files;
        file_input.clear();
    }
    buidStringList(list: any[]) {

        let str = "";
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].Value + ',';
        };
        if (list.length > 0) str = str.substr(0, str.lastIndexOf(','));
        return str;
    }
    save() {
        if(!this.createModel.Summary)
        {
            this.messageService.add({ severity: 'warn', summary: 'Nội dung vắn tắt không được để trống'});
            return;
        }
         
        if (this.files_selected.length > 0) {
            this._upload.UploadFile(this.folder, this.files_selected).subscribe(res => {
                if (res.status) {

                    this.createModel.AttachedFileUrl = this.buidStringList(res.result);
                    this.RealSave();
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Upload file không thành công!',detail:'Chi tiết: '+ res.message});
                }
            })
        }
        else {
            this.RealSave();
        }

    }
    RealSave(){
        this._status.Create(this.statusDoc).subscribe(res=>{
            if(res.Status==1){
                this.createModel.DocumentStatusId=res.Data.Id;
                this._service.Create(this.createModel).subscribe(res1=>{
                    if(res1.Status==1){
                        this.router.navigate(['/van-ban-den'])
                    }
                })
            }
            else{
                this.messageService.add({ severity: 'error', summary: 'Tạo văn bản không thành công',detail:res.Message });
            }
        })
    }
    DeleteFile(index){
        this.files_selected = this.files_selected.filter((val, j) => j != index);
      //  this.files_selected.filter()
    }
}
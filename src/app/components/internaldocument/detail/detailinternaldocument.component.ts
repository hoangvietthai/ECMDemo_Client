import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem,ConfirmationService,MessageService } from 'primeng/api';
import { InternalDocumentCreateModel, InternalDocumentUpdateModel, InternalDocumentModel } from '../internaldocument';
import { InternalDocumentService } from '../internaldocument.service';
import { DocumentCateService } from '../../categories/category.service';
import { UserService } from '../../user/user.service';
import { SecretLevels, DeliveryMethods, uploadDataUrl } from '../../../app.global';
import { BusinessPartnerService } from '../../businesspartner/businesspartner.service';
import { DepartmentService } from '../../department/department.service';
import { ContactPersonService } from '../../contactperson/contactperson.service';
import { ReceivedDocumentService } from '../../receiveddocument/receiveddocument.service';
import { DocumentStatusUpdateModel,StatusType } from '../../documentstatus/documentstatus';
import { DocumentStatusService } from '../../documentstatus/documentstatus.service';
import { DirectoryService } from '../../directory/directory.service';
import { Router,ActivatedRoute } from '@angular/router';
import {UploadService} from '../../upload/upload.service';
@Component({
    templateUrl: './detailternaldocument.component.html',
    providers: [
        InternalDocumentService,
        DocumentCateService,
        UserService,
        BusinessPartnerService,
        DepartmentService,
        ContactPersonService,
        ReceivedDocumentService,
        DocumentStatusService,
        DirectoryService,
        ConfirmationService,
        MessageService,
        UploadService
    ]
})
export class DetailInternalDocumentComponent implements OnInit {
    updateModel: InternalDocumentUpdateModel = {};
    mainModel:InternalDocumentModel={};
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    dm_cates: SelectItem[] = [];
    dm_delivery_methods: any[];
    dm_secretlevels: any[];
    dm_partners: SelectItem[];
    users: any[];
    departments: SelectItem[];
    dm_contacts: SelectItem[];
    dm_receives: SelectItem[];
    dm_directories: SelectItem[];
    statusDoc:DocumentStatusUpdateModel;
    files_selected: any[] = [];
    folder: string;
    crnt_user: any;
    uploadDataUrl: string = uploadDataUrl;
    private sub: any;
    Id: number;
    files_of_doc: any[];
    blocked: boolean = true;
    constructor(
        private _service: InternalDocumentService,
        private _receive: ReceivedDocumentService,
        private _cate: DocumentCateService,
        private _user: UserService,
        private _partner: BusinessPartnerService,
        private _department: DepartmentService,
        private _contact: ContactPersonService,
        private _status: DocumentStatusService,
        private _router: Router,
        private activeRouter:ActivatedRoute,
        private _dir: DirectoryService,
        private confirmationService:ConfirmationService,
        private messageService:MessageService,
        private _upload:UploadService
    ) {
        this.users = [];
        this.dm_cates = [];
        this.departments = [];
        this.dm_partners = [];
        this.dm_delivery_methods = DeliveryMethods;
        this.dm_secretlevels = SecretLevels;
        this.dm_receives = [];
        this.dm_directories=[];
        this.BreadcrumbItems = [
            { label: 'Văn bản đi', url: '' },
            { label: 'Tạo mới' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));
        this.folder = this.crnt_user.UserId + '/' + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
    }
    ngOnInit() {
    
        this.sub = this.activeRouter.params.subscribe(params => {
            this.Id = params['Id'];
            this._service.getById(this.Id).subscribe(res1=>{
                if(res1.Status==1){
         
                    this.mainModel=res1.Data;
                 
                 
                 
                  
                    this.updateModel.DocumentStatusId=res1.Data.DocumentStatusId;
                    this.updateModel.LastModifiedByUserId=res1.Data.LastModifiedByUserId;
                    this.updateModel.Name=res1.Data.Name;
                    this.updateModel.ProjectId=res1.Data.ProjectId;
                    this.updateModel.ResignedNumber=res1.Data.ResignedNumber;
                    this.updateModel.ResignedOnDate=new Date(res1.Data.ResignedOnDate);
                    this.updateModel.SecretLevel=res1.Data.SecretLevel;
                    this.updateModel.Summary=res1.Data.Summary;
                    this.updateModel.AttachedFileUrl=this.mainModel.AttachedFileUrl;

                    this._status.getById(this.mainModel.DocumentStatusId).subscribe(res => {
                        if (res.Status == 1) {
                            this.statusDoc = {
                                ConfirmRelatedId: res.Data.ConfirmRelatedId,
                                PerformRelatedId: res.Data.PerformRelatedId,
                                RegisterRelatedId: res.Data.RegisterRelatedId,
                                UnifyRelatedId: res.Data.UnifyRelatedId,
                                ConfirmStatus: res.Data.ConfirmStatus,
                                PerformStatus: res.Data.PerformStatus,
                                RegisterStatus: res.Data.RegisterStatus,
                                UnifyStatus: res.Data.UnifyStatus,
                                DisplayName: res.Data.DisplayName
                            };
                            this.statusDoc.DisplayName = this.buildStatusName();
                        }
                    })
                    if (this.updateModel.AttachedFileUrl)
                        this.files_of_doc = this.updateModel.AttachedFileUrl.split(',').filter(n => n);


                    this._cate.getAll().subscribe(res => {
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.dm_cates.push({ value: res.Data[i].CategoryId, label: res.Data[i].Name });
                            }
                           
                            this.updateModel.CategoryId=this.mainModel.CategoryId;
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
                            this.updateModel.WrittenByUserId=this.mainModel.WrittenByUserId;
                            this.updateModel.ResponsibleUserId=this.mainModel.ResponsibleUserId;
                        }
                    });
                    //
                    this._partner.getAll().subscribe(res => {
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
                    this._department.getAll().subscribe(res => {
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.departments.push({
                                    value: res.Data[i].DepartmentId,
                                    label: res.Data[i].Name
                                });
                            }
                            this.updateModel.DepartmentId=this.mainModel.DepartmentId;
                        }
                    });
                    this._receive.getAllBase().subscribe(res => {
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.dm_receives.push({
                                    value: res.Data[i].ReceivedDocumentId,
                                    label: res.Data[i].Name
                                });
                            }
                        }
                    });
                    this.dm_directories.push({
                        value: 0,
                        label: 'Thư mục gốc'
                    });
                    this._dir.getAllByModule(1).subscribe(res => {
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.dm_directories.push({
                                    value: res.Data[i].DirectoryId,
                                    label: res.Data[i].Name
                                });
                            }
                            this.updateModel.DirectoryId=this.mainModel.DirectoryId;
                        }
                    })
                }
            })
        });
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
        if (this.files_selected.length > 0) {
            this._upload.UploadFile(this.folder, this.files_selected).subscribe(res => {
                if (res.status) {

                    this.updateModel.AttachedFileUrl = this.buidStringList(res.result);
                    this.RealSave();
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Upload file không thành công!' });
                }
            })
        }
        else {
            this.RealSave();
        }
    }
    RealSave() {
        this._service.Update(this.mainModel.InternalDocumentId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.files_selected = [];
                this.mainModel=res.Data;
                this.updateModel.Name = this.mainModel.Name;
                this.updateModel.Summary = this.mainModel.Summary;
                this.updateModel.DirectoryId=this.mainModel.DirectoryId;
                this.updateModel.CategoryId = this.mainModel.CategoryId;
                this.updateModel.SecretLevel = this.mainModel.SecretLevel;
                this.updateModel.ProjectId=this.mainModel.ProjectId;
                this.updateModel.DepartmentId = this.mainModel.DepartmentId;
                this.updateModel.DocumentStatusId = this.mainModel.DocumentStatusId;
                this.updateModel.WrittenByUserId=this.mainModel.WrittenByUserId;

                this.updateModel.LastModifiedByUserId = this.mainModel.LastModifiedByUserId;
                this.updateModel.AttachedFileUrl = this.mainModel.AttachedFileUrl;
                this.files_of_doc = this.updateModel.AttachedFileUrl.split(',').filter(n => n)             
                this.updateModel.ResponsibleUserId = this.mainModel.ResponsibleUserId;
                this.messageService.add({ severity: 'info', summary: 'Thay đổi thành công', detail: 'Thông văn bản đến đã được thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công', detail: 'Chi tiết: ' + res.Message });
            }
        })
    }
    OnSelectFile(event, file_input) {
        this.files_selected = file_input.files;
        file_input.clear();
    }
    Register(){
        this.confirmationService.confirm({
            message: 'Bạn chắc chắn muốn đăng ký tài liệu này chứ?',
            header: 'Xác nhận hành động',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service.Register(this.Id).subscribe(res => {
                    if (res.Status == 1) {
                        this.mainModel.ResignedNumber=res.Data.ResignedNumber;
                        this.mainModel.ResignedOnDate=new Date(res.Data.ResignedOnDate);
                        this.updateModel.ResignedNumber=res.Data.ResignedNumber;
                        this.updateModel.ResignedOnDate=new Date(res.Data.ResignedOnDate);
                        this.messageService.add({ severity: 'success', summary: 'Đăng ký thành công' });
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Đăng ký không thành công',detail:'Chi tiết: '+res.Message });
                    }
                })
            },
            reject: () => {

            }
        });
    }
    buildStatusName(){
        let return_='';
        switch(this.statusDoc.UnifyStatus){
            case StatusType.INPROCESS:{
                return_+='Đang thống nhất, ';
                break;
            }
            case StatusType.ACCEPTED:{
                return_+='Đã thống nhất, ';
                break;
            }
            case StatusType.REJECTED:{
                return_+='Không thống nhất, '
            }
            default:{
                return_=return_;
            }
        }
        switch(this.statusDoc.ConfirmStatus){
            case StatusType.INPROCESS:{
                return_+='Đang phê duyệt, ';
                break;
            }
            case StatusType.ACCEPTED:{
                return_+='Đã phê duyệt, ';
                break;
            }
            case StatusType.REJECTED:{
                return_+='Không phê duyệt, '
            }
            default:{
                return_=return_;
            }
        }
        if(this.mainModel.ResignedNumber!=null) return_+='Đã đăng ký';
        if(return_=='') return_='Dự thảo';
        return return_;
    }
}
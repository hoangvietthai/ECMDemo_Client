import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem,MessageService } from 'primeng/api';
import { InternalDocumentCreateModel } from '../internaldocument';
import { InternalDocumentService } from '../internaldocument.service';
import { DocumentCateService } from '../../categories/category.service';
import { UserService } from '../../user/user.service';
import { SecretLevels, DeliveryMethods, uploadDataUrl } from '../../../app.global';
import { BusinessPartnerService } from '../../businesspartner/businesspartner.service';
import { DepartmentService } from '../../department/department.service';
import { ContactPersonService } from '../../contactperson/contactperson.service';
import { ReceivedDocumentService } from '../../receiveddocument/receiveddocument.service';
import { DocumentStatusCreateModel,StatusType } from '../../documentstatus/documentstatus';
import { DocumentStatusService } from '../../documentstatus/documentstatus.service';
import { DirectoryService } from '../../directory/directory.service';
import { Router } from '@angular/router';
import {UploadService} from '../../upload/upload.service';
@Component({
    templateUrl: './createinternaldocument.component.html',
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
        UploadService,
        MessageService
    ]
})
export class CreateInternalDocumentComponent implements OnInit {
    createModel: InternalDocumentCreateModel = {};

    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    dm_cates: SelectItem[] = [];
    dm_delivery_methods: any[];
    dm_secretlevels: any[];
    send_methods: MenuItem[];
    dm_partners: SelectItem[];
    users: any[];
    departments: SelectItem[];
    dm_contacts: SelectItem[];
    dm_receives: SelectItem[];
    dm_directories: SelectItem[];
    files_selected:any[];
    folder: string;
    crnt_user:any;
    uploadDataUrl: string = uploadDataUrl;
    statusDoc:DocumentStatusCreateModel;
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
        private _dir: DirectoryService,
        private _upload:UploadService,
        private messageService:MessageService
    ) {
        this.users = [];
        this.dm_cates = [];
        this.departments = [];
        this.dm_partners = [];
        this.dm_delivery_methods = DeliveryMethods;
        this.dm_secretlevels = SecretLevels;
        this.dm_receives = [];
        this.dm_directories=[];
        this.send_methods = [
            {
                label: 'Đi xử lý', icon: 'pi pi-refresh', command: () => {
                    //
                }
            },
            {
                label: 'Cần thống nhất', icon: 'pi pi-times', command: () => {
                    //
                }
            },
            {
                label: 'Cần phê duyệt', icon: 'pi pi-times', command: () => {
                    //
                }

            },
            {
                label: 'Chờ tham khảo', icon: 'pi pi-times', command: () => {
                    //
                }
            }
        ];
        this.statusDoc = {
            UnifyStatus:StatusType.NOTSET,
            ConfirmStatus:StatusType.NOTSET,
            PerformStatus:StatusType.NOTSET,
            RegisterStatus:StatusType.NOTSET,
            DisplayName:'Dự Thảo'
        };
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
                    this.realSave();
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Upload file không thành công!',detail:'Chi tiết: '+ res.message});
                }
            })
        }
        else {
            this.realSave();
        }
        
    }
    realSave(){
        this._status.Create(this.statusDoc).subscribe(res=>{
            if(res.Status==1){
                this.createModel.DocumentStatusId=res.Data.Id;
                this._service.Create(this.createModel).subscribe(res1=>{
                    if(res1.Status==1){
                        this._router.navigate(['/van-ban-noi-bo'])
                    }
                })
            }
        })
    }
    DeleteFile(index){
        this.files_selected = this.files_selected.filter((val, j) => j != index);
      //  this.files_selected.filter()
    }
}
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { ReceivedDocumentUpdateModel, ReceivedDocumentModel } from '../receiveddocument';
import { ReceivedDocumentService } from '../receiveddocument.service';
import { DocumentCateService } from '../../categories/category.service';
import { UserService } from '../../user/user.service';
import { SecretLevels, DeliveryMethods } from '../../../app.global';
import { BusinessPartnerService } from '../../businesspartner/businesspartner.service';
import { DepartmentService } from '../../department/department.service';
import { ContactPersonService } from '../../contactperson/contactperson.service';
import { DocumentStatusService } from '../../documentstatus/documentstatus.service';
import { DocumentStatusUpdateModel, StatusType } from '../../documentstatus/documentstatus';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../../upload/upload.service';
import { uploadDataUrl } from '../../../app.global';
@Component({
    templateUrl: './detailreceiveddocument.component.html',
    providers: [
        ReceivedDocumentService,
        DocumentCateService,
        UserService,
        BusinessPartnerService,
        DepartmentService,
        ContactPersonService,
        DocumentStatusService,
        UploadService,
        MessageService,
        ConfirmationService
    ]
})
export class UpdateReceivedDocumentComponent implements OnInit {
    mainModel: ReceivedDocumentModel = {};
    updateModel: ReceivedDocumentUpdateModel = {};
    directories: any[];
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    dm_cates: SelectItem[] = [];
    dm_delivery_methods: any[];
    dm_secretlevels: any[];
    dm_partners: SelectItem[];
    users: any[];
    departments: SelectItem[];
    dm_contacts: SelectItem[];
    statusDoc: DocumentStatusUpdateModel;
    files_selected: any[] = [];
    folder: string;
    crnt_user: any;
    uploadDataUrl: string = uploadDataUrl;
    private sub: any;
    Id: number;
    files_of_doc: any[];
    blocked: boolean = true;

    constructor(
        private _service: ReceivedDocumentService,
        private _cate: DocumentCateService,
        private _user: UserService,
        private _partner: BusinessPartnerService,
        private _department: DepartmentService,
        private _contact: ContactPersonService,
        private _status: DocumentStatusService,
        private router: Router,
        private _upload: UploadService,
        private messageService: MessageService,
        private _router: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) {
        this.users = [];
        this.dm_cates = [];
        this.departments = [];
        this.dm_partners = [];
        this.dm_delivery_methods = DeliveryMethods;
        this.dm_secretlevels = SecretLevels;
        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));
        this.folder = this.crnt_user.UserId + '/' + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
    }
    ngOnInit() {
        this.sub = this._router.params.subscribe(params => {
            this.Id = params['Id'];
            this._service.getById(this.Id).subscribe(res => {
                if (res.Status == 1) {
                    console.log(res.Data);
                    this.mainModel = res.Data;
                    this.updateModel.Name = this.mainModel.Name;
                    this.updateModel.Summary = this.mainModel.Summary;

                    this.updateModel.DeliveryMethodId = this.mainModel.DeliveryMethodId;
                    this.updateModel.SecretLevel = this.mainModel.SecretLevel;
                    this.updateModel.DocumentStatusId = this.mainModel.DocumentStatusId;
                    this.updateModel.ResignedNumber = this.mainModel.ResignedNumber;
                    this.updateModel.ResignedOnDate = new Date(this.mainModel.ResignedOnDate);

                    this.updateModel.DocumentIndex = this.mainModel.DocumentIndex;
                    this.updateModel.DocumentDate = new Date(this.mainModel.DocumentDate);



                    this.updateModel.LastModifiedByUserId = this.mainModel.LastModifiedByUserId;
                    this.updateModel.AttachedFileUrl = this.mainModel.AttachedFileUrl;

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
                            this.updateModel.CategoryId = this.mainModel.CategoryId;
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
                            this.updateModel.ReceiverId = this.mainModel.ReceiverId;
                            this.updateModel.ReceiverUserId = this.mainModel.ReceiverUserId;
                            this.updateModel.ResponsibleUserId = this.mainModel.ResponsibleUserId;
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
                            this.updateModel.SenderId = this.mainModel.SenderId;
                            this._contact.getAllByPartnerId(this.updateModel.SenderId).subscribe(res => {
                                if (res.Status == 1) {
                                    this.dm_contacts = [];
                                    for (let i = 0; i < res.Data.length; i++) {
                                        this.dm_contacts.push({
                                            value: res.Data[i].ContactPersonId,
                                            label: res.Data[i].Name
                                        });
                                    }
                                    if (this.dm_contacts.length > 0) this.updateModel.SignedByUserId = this.dm_contacts[0].value;

                                }
                            })
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
                            this.updateModel.DepartmentId = this.mainModel.DepartmentId;
                        }
                    })

                }
            })
        })
        this.BreadcrumbItems = [
            { label: 'Văn bản đi', url: '' },
            { label: 'Tạo mới' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        //

    }
    OnPartnerChange(event: any) {
        this.dm_contacts = [];
        let selectedPartnerId = event.value;
        this._contact.getAllByPartnerId(selectedPartnerId).subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_contacts.push({
                        value: res.Data[i].ContactPersonId,
                        label: res.Data[i].Name
                    });
                }
                if (this.dm_contacts.length > 0) this.updateModel.SignedByUserId = this.dm_contacts[0].value;

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
        this._service.Update(this.mainModel.ReceivedDocumentId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.files_selected = [];
                this.mainModel = res.Data;
                this.updateModel.Name = this.mainModel.Name;
                this.updateModel.CategoryId = this.mainModel.CategoryId;
                this.updateModel.AttachedFileUrl = this.mainModel.AttachedFileUrl;
                this.files_of_doc = this.updateModel.AttachedFileUrl.split(',').filter(n => n);
                this.updateModel.ResignedNumber = this.mainModel.ResignedNumber;
                this.updateModel.ResignedOnDate = new Date(this.mainModel.ResignedOnDate);
                this.updateModel.DocumentDate = new Date(this.mainModel.DocumentDate);
                this.updateModel.DocumentIndex = this.mainModel.DocumentIndex;
                this.updateModel.SignedByUserId = this.mainModel.SignedByUserId;

                this.updateModel.ResponsibleUserId = this.mainModel.ResponsibleUserId;
                this.updateModel.ReceiverId = this.mainModel.ReceiverId;
                this.updateModel.SecretLevel = this.mainModel.SecretLevel;
                this.updateModel.SenderId = this.mainModel.SenderId;
                this.updateModel.ReceiverUserId = this.mainModel.ReceiverUserId;
                this.updateModel.Summary = this.mainModel.Summary;
                this.updateModel.DepartmentId = this.mainModel.DepartmentId;

                this.updateModel.DeliveryMethodId = this.mainModel.DeliveryMethodId;

                this.updateModel.DocumentStatusId = this.mainModel.DocumentStatusId;
                this.updateModel.LastModifiedByUserId = this.mainModel.LastModifiedByUserId;
                this.messageService.add({ severity: 'info', summary: 'Thay đổi thành công', detail: 'Thông văn bản đến đã được thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công', detail: 'Chi tiết: ' + res.Message });
            }
        })
    }
    buildStatusName() {
        let return_ = '';
        switch (this.statusDoc.UnifyStatus) {
            case StatusType.INPROCESS: {
                return_ += 'Đang thống nhất, ';
                break;
            }
            case StatusType.ACCEPTED: {
                return_ += 'Đã thống nhất, ';
                break;
            }
            case StatusType.REJECTED: {
                return_ += 'Không thống nhất, '
            } default: {
                return_ = return_;
            }
        }
        switch (this.statusDoc.ConfirmStatus) {
            case StatusType.INPROCESS: {
                return_ += 'Đang phê duyệt, ';
                break;
            }
            case StatusType.ACCEPTED: {
                return_ += 'Đã phê duyệt, ';
                break;
            }
            case StatusType.REJECTED: {
                return_ += 'Không phê duyệt, '
            } default: {
                return_ = return_;
            }
        }
        if (this.mainModel.ResignedNumber != null) return_ += 'Đã đăng ký';
        if (return_ == '') return_ = 'Dự thảo';
        return return_;
    }
    Register() {
        this.confirmationService.confirm({
            message: 'Bạn chắc chắn muốn đăng ký tài liệu này chứ?',
            header: 'Xác nhận hành động',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service.Register(this.Id).subscribe(res => {
                    if (res.Status == 1) {
                        this.mainModel.ResignedNumber = res.Data.ResignedNumber;
                        this.mainModel.ResignedOnDate = new Date(res.Data.ResignedOnDate);
                        this.updateModel.ResignedNumber = res.Data.ResignedNumber;
                        this.updateModel.ResignedOnDate = new Date(res.Data.ResignedOnDate);
                        this.messageService.add({ severity: 'success', summary: 'Đăng ký thành công' });
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Đăng ký không thành công', detail: 'Chi tiết: ' + res.Message });
                    }
                })
            },
            reject: () => {

            }
        });
    }
    
}
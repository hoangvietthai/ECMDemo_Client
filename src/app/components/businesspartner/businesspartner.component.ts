import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { BusinessPartnerService } from './businesspartner.service';
import { DialogService } from 'primeng/api';
import { BusinessPartnerDisplayModel, BusinessPartnerModel, BaseBusinessPartnerModel, BusinessPartnerCreateModel, BusinessPartnerUpdateModel } from './businesspartner';
import { CreatePartnerComponent } from './create/createbusinesspartner.component';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { UserService } from '../user/user.service';
import { PartnerTypes } from '../../app.global';
@Component({
    templateUrl: './businesspartner.component.html',
    providers: [
        BusinessPartnerService,
        DialogService,
        MessageService,
        ErrorDialogService,
        UserService,
        ConfirmationService
    ]
})
export class BusinessPartnerComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    partners: BusinessPartnerDisplayModel[];
    selectedPartner: BusinessPartnerDisplayModel;
    cols: any[];
    updateModel: BusinessPartnerUpdateModel = {};
    displayUpdateDialog: boolean = false;
    displayDetailDialog: boolean = false;
    dm_users: SelectItem[];
    dm_partnertypes: SelectItem[];
    mainModel: BusinessPartnerUpdateModel = {};
    constructor(
        private _service: BusinessPartnerService,
        private dialogService: DialogService,
        private errorDialogService: ErrorDialogService,
        private messageService: MessageService,
        private _user: UserService,
        private confirmationService: ConfirmationService
    ) {
        this.dm_partnertypes = PartnerTypes;
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục phòng ban' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this._service.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.partners = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên tài khoản' },
                    { field: 'PhoneNumber', header: 'Số điện thoại' },
                    { field: 'ResponsibleUserFullName', header: 'Người chịu trách nhiệm' }

                ];
            }
        });
        this._user.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.dm_users = [];
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName + ' (' + res.Data[i].FullName + ')'
                    });
                }
            }
        });
    }
    showDialogToAdd() {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            const ref = this.dialogService.open(CreatePartnerComponent, {
                header: 'Tạo mới đối tác',
                width: '900px'
            });

            ref.onClose.subscribe((res: any) => {
                if (res.Status == 1) {
                    this.partners = [];
                    this._service.getAll().subscribe(res => {
                        if (res.Status == 1) {
                            this.partners = res.Data;
                            this.cols = [
                                { field: 'Name', header: 'Tên tài khoản' },
                                { field: 'ResponsibleUserFullName', header: 'Tên đầy đủ' },
                                { field: 'PhoneNumber', header: 'Phòng ban' }
                            ];
                        }
                    })
                    this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Đối tác mới: ' + res.Data.Name });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: 'Chi tiết: ' + res.Message });
                }
            });
        }
    }
    openDetail(item: any) {
        this.selectedPartner = item;
        //this.getUsers(item.DepartmentId);
        this._service.getById(this.selectedPartner.PartnerId).subscribe(res => {
            if (res.Status == 1) {
                this.mainModel = res.Data;
                this.displayDetailDialog=true;
            }
        })
    }
    openUpdate(item: any) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            this.selectedPartner = item;
            //this.getUsers(item.DepartmentId);
            this._service.getById(this.selectedPartner.PartnerId).subscribe(res => {
                if (res.Status == 1) {

                    this.updateModel = {};
                    this.updateModel.ActualAddress = res.Data.ActualAddress;
                    this.updateModel.AgencyCode = res.Data.AgencyCode;
                    this.updateModel.BusinessCode = res.Data.BusinessCode;
                    this.updateModel.BusinessRegisteredCode = res.Data.BusinessRegisteredCode;
                    this.updateModel.BusinessTypeId = res.Data.BusinessTypeId;
                    this.updateModel.Email = res.Data.Email;
                    this.updateModel.Fax = res.Data.Fax;
                    this.updateModel.Name = res.Data.Name;
                    this.updateModel.Note = res.Data.Note;
                    this.updateModel.PhoneNumber = res.Data.PhoneNumber;
                    this.updateModel.RegisteredAddress = res.Data.RegisteredAddress;
                    this.updateModel.ResponsibleUserId = res.Data.ResponsibleUserId;
                    this.updateModel.TaxCode = res.Data.TaxCode;
                    this.updateModel.Website = res.Data.Website;
                    this.displayUpdateDialog = true;
                }
            })
        }
    }
    update() {
        this._service.Update(this.selectedPartner.PartnerId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.messageService.add({ severity: 'info', summary: 'Cập nhật thông tin thành công' });
                this.displayUpdateDialog = false;
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.partners = [];
                        this.partners = res.Data;
                    }
                });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Cập nhật thông tin không thành công', detail: '' });
            }
        })
    }
    ConfirmDelete(item: any) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            this.confirmationService.confirm({
                message: 'Bạn chắc chắn muốn xóa dòng này chứ?',
                header: 'Xác nhận hành động',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service.Delete(item.PartnerId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.partners.indexOf(item);
                            this.partners = this.partners.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Đối tác đã được xóa thành công' });
                        }
                        else {
                            this.messageService.add({ severity: 'error', summary: 'Xóa không thành công', detail: 'Vui lòng thử lại sau' });
                        }
                    })
                },
                reject: () => {

                }
            });
        }
    }
}
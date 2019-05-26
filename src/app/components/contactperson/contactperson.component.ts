import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { ContactPersonService } from './contactperson.service';
import { DialogService } from 'primeng/api';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { BusinessPartnerService } from '../businesspartner/businesspartner.service';
import {
    ContactPersonCreateModel,
    ContactPersonDisplayModel, ContactPersonModel,
    ContactPersonUpdateModel,
    BaseContactPersonModel
} from './contactperson';
import { CreateContactPersonComponent } from './create/createcontactperson.component';
@Component({
    templateUrl: './contactperson.component.html',
    providers: [
        ContactPersonService,
        DialogService,
        MessageService,
        ErrorDialogService,
        ConfirmationService,
        BusinessPartnerService
    ]
})
export class ContactPersonComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    contacts: ContactPersonDisplayModel[];
    selectedContact: ContactPersonDisplayModel;
    mainModel: ContactPersonModel = {};
    cols: any[];
    displayUpdateDialog: boolean = false;
    displayDetailDialog: boolean = false;
    updateModel: ContactPersonUpdateModel = {};
    dm_partners: SelectItem[];
    constructor(
        private _service: ContactPersonService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private errorDialogService: ErrorDialogService,
        private confirmationService: ConfirmationService,
        private _partner: BusinessPartnerService
    ) {

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
                this.contacts = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên tài khoản' },
                    { field: 'Partner', header: 'Đối tác' },
                    { field: 'Position', header: 'Vị trí' },
                    { field: 'OfficePhoneNumber', header: 'Điện thoại văn phòng' },
                    { field: 'PersonalPhoneNumber', header: 'Điện thoại riêng' }
                ];
            }
        });
        this._partner.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.dm_partners = [];
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_partners.push({
                        value: res.Data[i].PartnerId,
                        label: res.Data[i].Name
                    });
                }
            }
        });
    }
    showDialogToAdd() {
        const ref = this.dialogService.open(CreateContactPersonComponent, {
            header: 'Tạo mới đối tượng',
            width: '500px'
        });

        ref.onClose.subscribe((newPartner: any) => {
            if (newPartner) {
                this.contacts = [];
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.contacts = res.Data;

                    }
                })
                this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Đối tượng mới: ' + newPartner.Name });
            }
        });
    }
    showDetail(item: any) {

        this.selectedContact = item;
        //this.getUsers(item.DepartmentId);
        this._service.getById(this.selectedContact.ContactPersonId).subscribe(res => {
            if (res.Status == 1) {
                this.mainModel = res.Data;
                this.displayDetailDialog = true;
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
            this.selectedContact = item;
            //this.getUsers(item.DepartmentId);
            this._service.getById(this.selectedContact.ContactPersonId).subscribe(res => {
                if (res.Status == 1) {
                    this.updateModel = {};
                    this.updateModel.PartnerId = res.Data.PartnerId;
                    this.updateModel.OfficePhoneNumber = res.Data.OfficePhoneNumber;
                    this.updateModel.Email = res.Data.Email;
                    this.updateModel.Name = res.Data.Name;
                    this.updateModel.Note = res.Data.Note;
                    this.updateModel.PersonalPhoneNumber = res.Data.PersonalPhoneNumber;
                    this.updateModel.Position = res.Data.Position;
                    this.displayUpdateDialog = true;
                }
            })
        }
    }
    update() {
        this._service.Update(this.selectedContact.ContactPersonId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.messageService.add({ severity: 'info', summary: 'Cập nhật thông tin thành công' });
                this.displayUpdateDialog = false;
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.contacts = [];
                        this.contacts = res.Data;
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
                    this._service.Delete(item.ContactPersonId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.contacts.indexOf(item);
                            this.contacts = this.contacts.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Người liên lạc đã được xóa thành công' });
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
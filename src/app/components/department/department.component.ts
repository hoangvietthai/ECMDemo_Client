import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { DepartmentCreateModel, DepartmentDisplayModel, DepartmentModel, DepartmentUpdateModel } from './department';
import { CreateUserComponent } from '../user/create/createuser.component';
import { TreeNode } from 'primeng/api';
import { DepartmentService } from './department.service';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { UserService } from '../user/user.service';
@Component({
    templateUrl: './department.component.html',
    providers: [
        DepartmentService,
        ErrorDialogService,
        ConfirmationService,
        UserService,
        DialogService
    ]
})
export class DepartmentComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    cols: any[];
    departments: DepartmentDisplayModel[];
    selectedDepartment: DepartmentDisplayModel;
    datas: TreeNode[];
    //
    dm_departments: SelectItem[];
    dm_users: SelectItem[];
    //
    createModel: DepartmentCreateModel = {};
    updateModel: DepartmentUpdateModel = {};
    detailModel: DepartmentModel;
    //
    displayUpdateDialog: boolean = false;
    displayDetailDialog: boolean = false;
    displayCreateDialog: boolean = false;
    //
    constructor(
        private _service: DepartmentService,
        private errorDialogService: ErrorDialogService,
        private confirmationService: ConfirmationService,
        private userService: UserService,
        private messageService: MessageService,
        private dialogService: DialogService
    ) {
        //this.departments=[];
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
                this.departments = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên phòng ban' },
                    { field: 'Leader', header: 'Người lãnh đạo' },
                    { field: 'Description', header: 'Mô tả' }
                ];
                this.getDepartment();
            }
        });


    }
    getDepartment() {
        this.dm_departments = [];
        this.dm_departments.push({
            value: null,
            label: "Không có"
        })
        for (let i = 0; i < this.departments.length; i++) {
            this.dm_departments.push({
                value: this.departments[i].DepartmentId,
                label: this.departments[i].Name
            })
        }
    }
    getUsers(DepartmentId: number) {
        this.dm_users = [];
        this.dm_users.push({
            value: 0,
            label: "Chưa có nhân viên nào"
        })
        this.userService.getAllByDepartment(DepartmentId).subscribe(res => {
            if (res.Status == 1) {
                this.dm_users = [];
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].FullName
                    })
                }
                if(this.dm_users.length>0){
                    this.updateModel.LeaderId=this.dm_users[0].value;
                }
            }
        });
    }
    openCreate() {
        this.createModel = {};
        this.displayCreateDialog = true;
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
            this.selectedDepartment = item;
            this.getUsers(item.DepartmentId);
            this._service.getById(item.DepartmentId).subscribe(res => {
                if (res.Status == 1) {
                    this.updateModel = {};
                    this.updateModel.Name = res.Data.Name;
                    this.updateModel.Description = res.Data.Description;
                    this.updateModel.ParentId = res.Data.ParentId;
                    if(res.Data.LeaderId){
                        this.updateModel.LeaderId = res.Data.LeaderId;
                    }
                    this.displayUpdateDialog = true;
                    
                }
            })
        }
    }
    create() {
        this._service.Create(this.createModel).subscribe(res => {
            if (res.Status == 1) {
                let _departs = [...this.departments];
                let newItem = {
                    DepartmentId: res.Data.DepartmentId,
                    Name: res.Data.Name,
                    Leader: "Chưa có trưởng phòng",
                    Description: res.Data.Description,
                    ParentId: res.Data.ParentId
                }
                _departs.unshift(newItem);
                this.departments = null;
                this.departments = _departs;
                this.displayCreateDialog = false;
                this.selectedDepartment = newItem;
                this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Phòng ban mới: ' + res.Data.Name });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
            }
        });
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
                    this._service.Delete(item.DepartmentId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.departments.indexOf(item);
                            this.departments = this.departments.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Phòng ban đã được xóa thành công' });
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
    openCreateUser() {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            const ref = this.dialogService.open(CreateUserComponent, {
                header: 'Tạo tào khoản',
                width: '500px'
            });
            ref.onClose.subscribe((res: any) => {
                if (res) {
                    if (res.Status == 1) {
                        this.getUsers(this.selectedDepartment.DepartmentId);
                        this.updateModel.LeaderId=res.Data.UserId;
                        this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'User Mới: ' + res.Data.FullName });
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
                    }
                }
            });
        }
    }
    update() {
        this._service.Update(this.selectedDepartment.DepartmentId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.messageService.add({ severity: 'info', summary: 'Cập nhật thông tin thành công' });
                this.displayUpdateDialog=false;
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.departments = res.Data;

                    }
                });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Cập nhật thông tin không thành công', detail: '' });
            }
        })
    }
}
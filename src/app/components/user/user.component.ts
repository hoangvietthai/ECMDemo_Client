import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, DialogService, MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { UserCreateModel, UserDisplayModel, UserModel, UserUpdateModel,UserDetailModel } from './user';
import { CreateUserComponent } from './create/createuser.component';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { ConfirmationService } from 'primeng/api';
import {DepartmentService} from '../department/department.service';
@Component({
    templateUrl: './user.component.html',
    providers: [
        UserService,
        DialogService,
        MessageService,
        ConfirmationService,
        DepartmentService
    ]
})
export class UserComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    users: UserDisplayModel[];
    cols: any[];
    dm_departments: SelectItem[];
    filter_departments:SelectItem[];
    selectedUser: UserDisplayModel;
    updateModel: UserUpdateModel = {};
    createModel: UserCreateModel = {};
    detailModel:UserDetailModel;
    displayUpdateDialog:boolean=false;
    displayDetailDialog:boolean=false;
    constructor(
        private _service: UserService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private errorDialogService: ErrorDialogService,
        
        private confirmationService: ConfirmationService,
        private _department:DepartmentService
    ) {
        this.users = [];
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Tài khoản hệ thống' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        //
        this.dm_departments=[];
        this.filter_departments=[];
        this.filter_departments.push({
            value:null,
            label:"Tất cả"
        })
        this._service.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.users = res.Data;
                this.cols = [
                    { field: 'UserName', header: 'Tên tài khoản' },
                    { field: 'FullName', header: 'Tên đầy đủ' },
                    { field: 'Department', header: 'Phòng ban' },
                    { field: 'UserRoleId', header: 'Chức vụ' },
                    { field: 'CreatedOnDate', header: 'Ngày tạo' }
                ];
            }
        });
        this._department.getAll().subscribe(res=>{
            for (let i = 0; i < res.Data.length; i++) {
                this.dm_departments.push({
                    value: res.Data[i].DepartmentId,
                    label: res.Data[i].Name 
                });
                this.filter_departments.push({
                    value: res.Data[i].Name,
                    label: res.Data[i].Name 
                });
            }
           })
    }
    getRole(role:number){
        switch(role){
            case 0:{
                return "Quản trị HT";
                break;
            }
            case 1:{
                return "Giám đốc";
                break;
            }
            case 2:{
                return "Trưởng phòng";
                break;
            }
            case 3:{
                return "Nhân viên";
                break;
            }
        }
    }
    openCreate() {
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

                        let users = [...this.users];
                        users.push(res.Data)
                        this.users = users;
                        this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'User Mới: ' + res.Data.FullName });
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
                    }
                }
            });
        }
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
                    this._service.Delete(item.UserId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.users.indexOf(item);
                            this.users = this.users.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Tài khoản đã được xóa thành công' });
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
    openUpdate(item:any) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            this.selectedUser = item;
            this._service.getById(item.UserId).subscribe(res => {
                if (res.Status == 1) {
                    this.updateModel = {};
                    this.updateModel.DepartmentId = res.Data.DepartmentId;
                    this.updateModel.FullName = res.Data.FullName;

                    this.updateModel.Password =  res.Data.Password;
                    this.updateModel.UserName = res.Data.UserName;
                    this.displayUpdateDialog = true;
                }
            })
        }
    }
    openDetail(item:any){
        this.selectedUser = item;
        this._service.getDetailById(item.UserId).subscribe(res => {
            if (res.Status == 1) {
                this.detailModel=res.Data;
                this.displayDetailDialog = true;
            }
        })
    }
    update() {
        this._service.Update(this.selectedUser.UserId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.displayUpdateDialog = false;
               
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.users = [];
                        this.users = res.Data;
                    }
                });

                this.messageService.add({ severity: 'info', summary: 'Thay đổi thành công', detail: 'Thông tin tài khoản đã được thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công', detail: 'Chi tiết: ' + res.Message });
            }
        })
    }
}
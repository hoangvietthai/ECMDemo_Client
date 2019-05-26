import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { FilterDocument } from './globaldocument';
import { GlobalDocumentService } from './globaldocument.service';
import { DepartmentService } from '../department/department.service';
import { DirectoryService } from '../directory/directory.service';
import { DocumentCateService } from '../categories/category.service';
import { UserService } from '../user/user.service';
import { CategoryGroupModel } from '../categories/category';
@Component({
    templateUrl: './globaldocument.component.html',
    providers: [
        DialogService,
        MessageService,
        GlobalDocumentService,
        DepartmentService,
        DirectoryService,
        DocumentCateService,
        UserService
    ]
})
export class GlobalDocumentComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    cols: any[];
    selectedFile: any;
    dm_departments: SelectItem[] = [];
    dm_directories: SelectItem[] = [];
    dm_users: SelectItem[] = [];
    dm_groupcates: SelectItem[] = [];
    dm_cates: SelectItem[] = [];
    mainModel: FilterDocument = {};
    activeGroup: CategoryGroupModel;
    cates: any[];
    docs: any[];
    rangeDates: Date[];
    resultString: boolean = false;
    displayDetail: boolean = false;
    constructor(
        private dialogService: DialogService,
        private messageService: MessageService,
        private _service: GlobalDocumentService,
        private _department: DepartmentService,
        private _directory: DirectoryService,
        private _cate: DocumentCateService,
        private _user: UserService
    ) {
        this.dm_departments.push({
            value: null,
            label: "Tất cả"
        });
        this.dm_directories.push({
            value: null,
            label: "Tất cả"
        });
        this.dm_users.push({
            value: null,
            label: "Tất cả"
        });
        this.dm_groupcates.push({
            value: null,
            label: "Tất cả"
        });
        this.dm_cates.push({
            value: null,
            label: "Tất cả"
        });
        this.cols = [
            { field: 'Name', header: 'Tên gọi' },
            { field: 'CreatedByUserName', header: 'Tác giả' },
            { field: 'CreatedOnDate', header: 'Ngày tạo' },
            { field: 'LastModifiedOnDate', header: 'Lần thay đổi cuối' }
        ];
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Truy vấn tài liệu', url: '' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this.mainModel = {};
        this.mainModel.Name = "";
        this._department.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_departments.push({
                        value: res.Data[i].DepartmentId,
                        label: res.Data[i].Name
                    });
                }

            }
        });
        this._directory.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_directories.push({
                        value: res.Data[i].DirectoryId,
                        label: res.Data[i].Name
                    });
                }

            }
        });
        this._user.getAllBase().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].FullName
                    });
                }

            }
        });
        this._cate.getAllGroup().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_groupcates.push({
                        value: res.Data[i].DocumentCateGroupId,
                        label: res.Data[i].Name
                    });
                }

            }
        });
        this._cate.getActiveGroup().subscribe(res => {
            if (res.Status == 1) {
                this.activeGroup = res.Data;
                this._cate.getAllInGroup(this.activeGroup.DocumentCateGroupId).subscribe(r => {
                    if (r.Status == 1) {
                        for (let i = 0; i < r.Data.length; i++) {
                            this.dm_cates.push({
                                value: r.Data[i].CategoryId,
                                label: r.Data[i].Name
                            });
                        }
                    }
                })
            }
        });
        this._cate.getAll().subscribe(r => {
            if (r.Status == 1) {
                this.cates=[];
                for (let i = 0; i < r.Data.length; i++) {
                    this.cates.push({
                        value: r.Data[i].CategoryId,
                        label: r.Data[i].Name
                    });
                }
            }
        })
    }
    getCateString(str: string) {
        let _str = '';
        let str_arr = str.split(',').filter(i => i);
        let results = this.cates.filter(c => c.value).filter(c => str_arr.includes(c.value.toString())).filter(function (el) { return el; });
        for (let i = 0; i < results.length; i++) {
            _str += results[i].label + ',';
        }
        return _str;
    }
    OpenDetail(item: any) {
        this.selectedFile = item;
        this.displayDetail = true;
    }
    DateRangeChange(event: any) {
        console.log(event);
    }
    GroupCateChange(event) {
        this._cate.getAllInGroup(event.value).subscribe(res => {
            if (res.Status == 1) {
                this.dm_cates = [];
                this.dm_cates.push({
                    value: null,
                    label: "Tất cả"
                });
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_cates.push({
                        value: res.Data[i].CategoryId,
                        label: res.Data[i].Name
                    });
                }
            }
        })
    }
    getResult() {
        console.log(this.rangeDates);
        if (this.rangeDates) {
            this.mainModel.StartDate = this.rangeDates[0];
            this.mainModel.EndDate = this.rangeDates[1];
        }

        this._service.getAll(this.mainModel).subscribe(res => {
            if (res.Status == 1) {
                this.docs = null;
                this.docs = res.Data;
                this.resultString = true;
            }
            else {
                alert('Something went wrong. Please try later!');
            }
        })
    }


}
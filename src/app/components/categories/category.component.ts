import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, TreeNode, MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { DocumentCateService } from './category.service';
import { CategoryModel, CategoryCreateModel, CategoryUpdateModel, CategoryGroupModel } from './category';
import { CreateCategoryComponent } from './create/createcategory.component';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
@Component({
    templateUrl: './category.component.html',
    providers: [
        DocumentCateService,
        MessageService,
        ConfirmationService,
        ErrorDialogService
    ]
})
export class DocumentCategoryComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    selectedNode: any;
    cols: any[];
    groups: CategoryGroupModel[];
    cates: CategoryModel[];
    selectedGroup: CategoryGroupModel;
    checked:boolean=false;
    activeGroup: CategoryGroupModel;
    //
    createModel: CategoryCreateModel = {};
    updateModel: CategoryUpdateModel = {};
    newGroupName: string;
    dm_groups: SelectItem[] = [];

    group_nodes: TreeNode[];
    //
    displayUpdateDialog: boolean = false;
    displayUpdateDialog1: boolean = false;
    displayDetailDialog: boolean = false;
    displayCreateDialog: boolean = false;
    //
    constructor(
        private _service: DocumentCateService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private dialogService: DialogService,
        private errorDialogService: ErrorDialogService
    ) {

    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục thể loại tài liệu' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this._service.getAllGroup().subscribe(res => {
            if (res.Status == 1) {
                this.groups = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Thể loại' }
                ];
                for (let i = 0; i < this.groups.length; i++) {
                    this.dm_groups.push({
                        value: this.groups[i].DocumentCateGroupId,
                        label: this.groups[i].Name
                    })
                }
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.cates = res.Data;
                        this.loadNodes();
                    }
                })
            }
        });
        this._service.getActiveGroup().subscribe(res => {
            if (res.Status == 1) {
                this.activeGroup = res.Data;
            }
        })
    }
    loadNodes() {
        this.group_nodes = [];
        for (let i = 0; i < this.groups.length; i++) {
            this.group_nodes.push(
                {
                    data: {
                        Name: this.groups[i].Name,
                        CategoryGroupId: this.groups[i].DocumentCateGroupId
                    },
                    children: this.GetCates(i)
                }
            )
        }

    }
    Unlock(event){
        this.confirmationService.confirm({
            message: 'Thay đổi này sẽ được áp dụng nên toàn hệ thống, bạn chắc chắn chứ?',
            header: 'Xác nhận hành động',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
               
            },
            reject: () => {
                this.checked=!this.checked;
            }
        });
    }
    ChangeActive(event: any) {
        this._service.ChangeActiveGroup(event.value).subscribe(res => {
            if (res.Status == 1) {
              
                this.activeGroup = res.Data;
                this.messageService.add({ severity: 'success', summary: 'Thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công' });
            }
        })
    }
    GetCates(index: number) {
        let results: TreeNode[] = [];
        this.cates.filter(c => c.CategoryGroupId == this.groups[index].DocumentCateGroupId).forEach(function (value) {
            results.push({
                data: {
                    Name: value.Name,
                    Description: value.Description,
                    CategoryId: value.CategoryId,
                    CategoryGroupId: value.CategoryGroupId
                }
            })
        });
        return results;
    }
    nodeSelect(event) {
        if (event.node.data.CategoryId) {

        }
        else {

        }
        //this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.data.CategoryId});
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
            const ref = this.dialogService.open(CreateCategoryComponent, {
                header: 'Tạo thể loại tài liệu',
                width: '500px'
            });

            ref.onClose.subscribe((res: any) => {
                if (res) {
                    if (res.Status == 1) {
                        this.group_nodes = [];
                        this._service.getAllGroup().subscribe(res => {
                            if (res.Status == 1) {
                                this.groups = res.Data;
                                this.cols = [
                                    { field: 'Name', header: 'Thể loại' }
                                ];
                                for (let i = 0; i < this.groups.length; i++) {
                                    this.dm_groups.push({
                                        value: this.groups[i].DocumentCateGroupId,
                                        label: this.groups[i].Name
                                    })
                                }
                                this._service.getAll().subscribe(res => {
                                    if (res.Status == 1) {
                                        this.cates = res.Data;
                                        this.loadNodes();
                                    }
                                })
                            }
                        })
                        this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'User Mới: ' + res.Data.FullName });

                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
                    }

                }
            })
        }
    }
    openUpdate() {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            if (this.selectedNode.parent == null) {
                console.log(this.selectedNode.data);
                this._service.getGroupById(this.selectedNode.data.CategoryGroupId).subscribe(res => {
                    if (res.Status == 1) {
                        this.newGroupName = res.Data.Name;
                        this.displayUpdateDialog1 = true;
                    }
                })
            }
            else {
                this._service.getById(this.selectedNode.data.CategoryId).subscribe(res => {
                    if (res.Status == 1) {
                        this.updateModel = {
                            Name: res.Data.Name,
                            Description: res.Data.Description
                        };
                        this.displayUpdateDialog = true;

                    }
                })
            }
        }
    }
    update() {
        this._service.Update(this.selectedNode.data.CategoryId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this._service.getAllGroup().subscribe(res => {
                    if (res.Status == 1) {
                        this.groups = res.Data;
                        for (let i = 0; i < this.groups.length; i++) {
                            this.dm_groups.push({
                                value: this.groups[i].DocumentCateGroupId,
                                label: this.groups[i].Name
                            })
                        }
                        this._service.getAll().subscribe(res => {
                            if (res.Status == 1) {
                                this.cates = res.Data;
                                this.loadNodes();
                            }
                        })
                        this.displayUpdateDialog = false;
                    }
                })
                this.messageService.add({ severity: 'success', summary: 'Thay đổi thông tin thành công', detail: 'Thông tin thể loại đã được thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi thông tin không thành công', detail: 'Đã có lỗi xảy ra' });
            }
        })
    }
    update1() {
        this._service.UpdateGroup(this.selectedNode.data.CategoryGroupId, { Name: this.newGroupName }).subscribe(res => {
            if (res.Status == 1) {
                this._service.getAllGroup().subscribe(res => {
                    if (res.Status == 1) {
                        this.groups = res.Data;
                        for (let i = 0; i < this.groups.length; i++) {
                            this.dm_groups.push({
                                value: this.groups[i].DocumentCateGroupId,
                                label: this.groups[i].Name
                            })
                        }
                        this._service.getAll().subscribe(res => {
                            if (res.Status == 1) {
                                this.cates = res.Data;
                                this.loadNodes();
                            }
                        })
                        this.displayUpdateDialog1 = false;
                    }
                })
                this.messageService.add({ severity: 'success', summary: 'Thay đổi thông tin thành công', detail: 'Tên nhóm thể loại đã được cập nhật thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi thông tin không thành công', detail: 'Đã có lỗi xảy ra' });
            }
        })
    }
    deleteItem() {
        console.log(this.selectedNode);
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 0) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            if (this.selectedNode.parent != null) {
                this.confirmationService.confirm({
                    message: 'Bạn chắc chắn muốn xóa thể loại tài liệu này chứ?',
                    header: 'Xác nhận hành động',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._service.Delete(this.selectedNode.data.CategoryId).subscribe(res => {
                            if (res.Status == 1) {
                                if (res.Status == 1) {
                                    let newList = [...this.group_nodes];
                                    let parent = this.group_nodes.filter(c => c.data.CategoryGroupId == this.selectedNode.parent.data.CategoryGroupId)[0];
                                    let index = parent.children.indexOf(this.selectedNode);
                                    parent.children = parent.children.filter((val, j) => j != index);
                                    newList.filter(c => c.data.CategoryGroupId == this.selectedNode.parent.data.CategoryGroupId)[0] = parent;
                                    this.group_nodes = newList;
                                    //this.group_nodes = this.group_nodes.filter((val, j) => j != index);
                                    this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Nhóm thể loại đã được xóa thành công' });
                                }
                                else {
                                    this.messageService.add({ severity: 'error', summary: 'Xóa không thành công', detail: 'Vui lòng thử lại sau' });
                                }
                            }
                        })
                    },
                    reject: () => {

                    }
                });

            }
            else {
                this.confirmationService.confirm({
                    message: 'Nếu xóa nhóm thể loại này toàn bộ các thể loại con cũng bị xóa. Bạn chắc chứ?',
                    header: 'Xác nhận hành động',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._service.DeleteGroup(this.selectedNode.data.CategoryGroupId).subscribe(res => {
                            if (res.Status == 1) {
                                let index = this.group_nodes.indexOf(this.selectedNode);
                                this.group_nodes = this.group_nodes.filter((val, j) => j != index);
                                this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Nhóm thể loại đã được xóa thành công' });
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



}
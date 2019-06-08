import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, DialogService, TreeNode, ConfirmationService } from 'primeng/api';
import { InternalDocumentService } from './internaldocument.service';
import { InternalDocumentCreateModel, InternalDocumentDisplayModel, InternalDocumentModel, InternalDocumentUpdateModel } from './internaldocument';
import { BusinessPartnerService } from '../businesspartner/businesspartner.service';
import { CreateDirectoryComponent } from '../directory/create/createdirectory.component';
import { DirectoryService } from '../directory/directory.service';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { DirectoryUpdateModel } from '../directory/directory';
import { CreateProcessComponent } from '../documentprocess/create/createprocess.component';
import { Module } from '../home/taskmessage';
import {DocumentStatusService} from '../documentstatus/documentstatus.service';
import { DocumentStatusModel } from '../documentstatus/documentstatus';
import { DetailProcessComponent } from '../documentprocess/detail/detailprocess.component';
import { DocumentProcessService } from '../documentprocess/documentprocess.service';
@Component({
    templateUrl: './internaldocument.component.html',
    providers: [
        InternalDocumentService,
        BusinessPartnerService,
        DialogService,
        MessageService,
        DirectoryService,
        ConfirmationService,
        ErrorDialogService,
        DocumentStatusService,
        DocumentProcessService
    ]
})
export class InternalDocumentComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    cols: any[];
    dirs: TreeNode[];
    selectedDoc: InternalDocumentDisplayModel;
    docs: InternalDocumentDisplayModel[];
    menu_context: MenuItem[];
    selectedNode: any;
    directories: any[];
    updateDirModel: DirectoryUpdateModel;
    displayUpdateDirNameDialog: boolean = false;
    process_methods: MenuItem[];
    constructor(
        private _service: InternalDocumentService,
        private _partner: BusinessPartnerService,
        public dialogService: DialogService,
        private messageService: MessageService,
        private _dir: DirectoryService,
        private confirmationService: ConfirmationService,
        private errorDialogService: ErrorDialogService,
        private _status:DocumentStatusService,
        private _process: DocumentProcessService
    ) {
        //
        this.process_methods = [
            {
                label: 'Quy trình mẫu', icon: 'fas fa-envelope-open-text', command: () => {
                    //Module
                    this.CreateAutoProcess();
                }
            },
            {
                label: 'Thêm mới quy trình', icon: '<i class="fas fa-plus"></i>', command: () => {
                    if (!this.selectedDoc.DocumentProcessId) {
                        const ref = this.dialogService.open(CreateProcessComponent, {
                            header: 'Tạo quy trình xử lý văn bản đi',

                            data: {
                                DocumentId: this.selectedDoc.InternalDocumentId,
                                ModuleType: Module.INTERNAL
                            }
                        });

                        ref.onClose.subscribe((_res: any) => {
                            if (_res) {
                                let process_start = _res.process_start;

                                let tmp = this.selectedDoc;
                                tmp.DocumentProcessId = _res.data;
                                let docs = [...this.docs];
                                docs[this.docs.indexOf(this.selectedDoc)] = tmp;
                                this.docs = docs;
                                this.selectedDoc = tmp;
                                this.GetProcesses();
                            }
                        });
                    }
                    else {
                        this.messageService.add({ severity: 'warn', summary: 'Tài liệu đã được tạo tiến trình rồi!' });
                    }
                }
            }
        ];
        //
        this.directories = [];
        this.directories.push({
            value: 0,
            label: 'Thư mục gốc'
        });
        this._dir.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.directories.push({
                        value: res.Data[i].DirectoryId,
                        label: res.Data[i].Name
                    });

                }

            }
        });
    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục thể loại tài liệu' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this.loadNodes();
        this._service.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.docs = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên gọi' },
                    { field: 'ResignedNumber', header: 'Số đăng ký' },
                    { field: 'ResignedOnDate', header: 'Ngày đăng ký' },
                    { field: 'WrittenByUserFullName', header: 'Người nhận' },
                    { field: 'CreatedOnDate', header: 'Ngày tạo' }
                ];
            }
        });
        this.menu_context = [
            {
                label: 'Tạo thư mục',
                icon: 'fas fa-plus',
                command: (event) => {

                    if (this.selectedNode) {
                        this.openCreateDir({
                            ParentId: this.selectedNode.data,
                            ModuleId: 1
                        });
                    }
                    else {
                        this.openCreateDir({
                            ParentId: 0,
                            ModuleId: 1
                        });
                    }

                    //event.originalEvent: Browser event
                    //event.item: menuitem metadata
                }
            },
            {
                label: 'Đổi tên thư mục',
                icon: 'fas fa-edit',
                command: (event) => {
                    if (this.selectedNode.data > 0) {
                        this._dir.getById(this.selectedNode.data).subscribe(res => {
                            if (res.Status == 1) {
                                this.updateDirModel = {
                                    Name: res.Data.Name,
                                    ParentId: res.Data.ParentId
                                }
                                this.displayUpdateDirNameDialog = true;
                            }
                        })


                    }
                }
            }
        ];
    }
    loadNodes() {
        this.dirs = [];
        this._dir.getAllNodes(1).subscribe(res => {
            if (res.Status == 1) {
                this.dirs.push({
                    label: "Thư mục",
                    data: null,
                    expandedIcon: "fa fa-folder-open",
                    collapsedIcon: "fa fa-folder",
                    children: res.Data
                });
                this.expandAll();
            }
        })
        this.expandAll();
    }
    expandAll() {
        this.dirs.forEach(node => {
            node.expanded = true;
        });
    }
    openCreateDir(data: any) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 2) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            const ref = this.dialogService.open(CreateDirectoryComponent, {
                header: 'Tạo thư mục văn bản nội bộ',
                width: '500px',
                data: data
            });

            ref.onClose.subscribe((newDir: any) => {
                if (newDir) {
                    this.directories.push({
                        value: newDir.DirectoryId,
                        label: newDir.Name
                    });
                    //  this.mainModel.DirectoryId = newDir.DirectoryId;
                    this.loadNodes();
                    this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thư mục mới: ' + newDir.Name });
                }
            });
        }
    }
    nodeSelect(event) {
        this.selectedNode = event.node;
        if (event.node.data != null) {
            this._service.getAllInDirectory(parseInt(event.node.data)).subscribe(res => {
                if (res.Status == 1) {
                    console.log(res.Data)
                    this.docs = [];
                    this.docs = res.Data;
                }
            });
        }
        else {
            this._service.getAll().subscribe(res => {
                if (res.Status == 1) {
                    this.docs = [];
                    this.docs = res.Data;
                }
            });
        }

    }
    updateDirName() {
        this._dir.Update(this.selectedNode.data, this.updateDirModel).subscribe(res => {
            if (res.Status == 1) {
                this.loadNodes();
                this.messageService.add({ severity: 'info', summary: 'Thay đổi thành công' });
                this.displayUpdateDirNameDialog = false;
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công' });
                this.displayUpdateDirNameDialog = false;
            }
        })
    }
    ConfirmDelete(item) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 2) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else{
            this.confirmationService.confirm({
                message: 'Bạn chắc chắn muốn xóa dòng này chứ?',
                header: 'Xác nhận hành động',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service.Delete(item.InternalDocumentId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.docs.indexOf(this.selectedDoc);
                            this.docs = this.docs.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Văn bản đã được xóa thành công' });
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
    GetProcesses() {
        if (this.selectedDoc) {
            if (this.selectedDoc.DocumentProcessId) {
                this._status.getById(this.selectedDoc.DocumentStatusId).subscribe(res => {
                    if (res.Status == 1) {
                        let st: DocumentStatusModel = res.Data;
                        const ref = this.dialogService.open(DetailProcessComponent, {
                            header: 'Tiến trình văn bản đi: ' + this.selectedDoc.Name,

                            data: {
                                Id: this.selectedDoc.DocumentProcessId,
                                Doc: {
                                    Name: this.selectedDoc.Name,
                                    Id: this.selectedDoc.InternalDocumentId,
                                    Module: Module.INTERNAL,
                                    Status: st,
                                    ProcessId: this.selectedDoc.DocumentProcessId
                                }
                            }
                        });
                        ref.onClose.subscribe((_res: any) => {


                        });
                    }
                });

            }
            else {
                this.messageService.add({ severity: 'warn', summary: 'Tài liệu chưa được tạo tiến trình' });
            }
        }
        else {
            this.messageService.add({ severity: 'warn', summary: 'Mời chọn một tài liệu' });
        }
    }
    CreateAutoProcess() {
        this.confirmationService.confirm({
            message: 'Bạn chắc chắn muốn áp dụng quy trình mẫu để xử lý tài liệu này?',
            header: 'Xác nhận hành động',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.selectedDoc) {
                    if (!this.selectedDoc.ResignedNumber) {
                        this._process.CreateAuto(this.selectedDoc.InternalDocumentId, Module.INTERNAL).subscribe(res => {
                            if (res.Status == 1) {
                                let tmp = this.selectedDoc;
                                tmp.DocumentProcessId = res.Data;
                                let docs = [...this.docs];
                                docs[this.docs.indexOf(this.selectedDoc)] = tmp;
                                this.docs = docs;
                                this.selectedDoc = tmp;
                                this.messageService.add({ severity: 'success', summary: 'Tạo tiến trình xử lý thành công' });
                                this.GetProcesses();
                            }
                            else {
                                this.messageService.add({ severity: 'warn', summary: 'Tạo tiến trình xử lý không thành công' });
                            }
                        })
                    }
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Bạn chưa chọn dòng nào' });
                }

            },
            reject: () => {

            }
        });
    }
}
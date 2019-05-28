import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { SelectItem, Message, MenuItem, TreeNode, MessageService } from 'primeng/api';
import { DocumentService } from './document.service';
import { UploadService } from '../upload/upload.service';
import { DocumentCreateModel, DocumentDisplayModel, DocumentModel, DocumentUpdateModel, ShareDocumentModel } from './document';
import { DocumentCateService } from '../categories/category.service';
import { DirectoryService } from '../directory/directory.service';
import { UserService } from '../user/user.service';
import { DialogService } from 'primeng/api';
import { CreateDirectoryComponent } from '../directory/create/createdirectory.component';
import { SelectDirectoryComponent } from '../directory/selectdir/selectdir.component';
import { SelectCategoryComponent } from '../categories/selectcategory/selectcategory.component';
import { uploadUrl, uploadDataUrl } from '../../app.global';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ConfirmationService } from 'primeng/api';
import { DirectoryUpdateModel } from '../directory/directory';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
import { DepartmentService } from '../department/department.service';
@Component({
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DocumentService,
        UploadService,
        DocumentCateService,
        DirectoryService,
        UserService,
        MessageService,
        DialogService,
        ConfirmationService,
        ErrorDialogService,
        DepartmentService
    ]
})
export class DocumentComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    cols: any[];
    docs: DocumentDisplayModel[];
    selectedFile: DocumentDisplayModel;
    createSelectedDir: any;
    selectedCate: any;
    displayCreateDialog: boolean = false;
    displayUpdateDialog: boolean = false;
    displayDetail: boolean = false;
    displayUpdateDirNameDialog: boolean = false;
    dm_cates: SelectItem[];
    dm_groupcates: SelectItem[];
    dm_departments: SelectItem[] = [];
    dirs: TreeNode[];
    directories: any[];
    selectedDir: TreeNode;
    displayCreate: boolean = false;
    displayCreate_1: boolean = false;
    displayShare: boolean = false;
    uploadFile: any;
    folder: string;
    cates: SelectItem[];
    users: any[];
    crnt_user: any;
    SelectedCateItem: any[];
    menu_context: MenuItem[];
    selectedNode: any;
    updateDirModel: DirectoryUpdateModel;
    msgs: Message[] = [];
    ShareDocumentModel: ShareDocumentModel = {};
    //
    groupCateId: number;
    //
    createModel: DocumentCreateModel = {};
    updateModel: DocumentUpdateModel = {};
    mainModel: DocumentModel = {};
    //
    progressRef: NgProgressRef;
    //
    constructor(
        private _service: DocumentService,
        private _upload: UploadService,
        private _cate: DocumentCateService,
        private _dir: DirectoryService,
        private _user: UserService,
        private messageService: MessageService,
        public dialogService: DialogService,
        private progress: NgProgress,
        private confirmationService: ConfirmationService,
        private errorDialogService: ErrorDialogService,
        private _department: DepartmentService
    ) {

    }
    loadNodes() {
        this.dirs = [];
        this._dir.getAllNodes(0).subscribe(res => {
            if (res.Status == 1) {
                this.dirs.push({
                    label: this.crnt_user.Department,
                    data: null,
                    expandedIcon: "fa fa-folder-open",
                    collapsedIcon: "fa fa-folder",
                    children: res.Data
                });
                if (this.crnt_user.DepartmentId != 0) {
                    this.dirs.push({
                        label: "Phòng văn thư",
                        data: 0,
                        expandedIcon: "fa fa-folder-open",
                        collapsedIcon: "fa fa-folder"
                    });
                }

                this.expandAll();
            }
        })
        this.expandAll();
    }
    ngOnInit() {
        this.progressRef = this.progress.ref();
        this.BreadcrumbItems = [
            { label: 'Văn bản và tệp', url: '' },
            { label: 'Quản lý tệp' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this._service.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.docs = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên gọi' },
                    { field: 'CreatedByUserName', header: 'Tác giả' },
                    { field: 'LastModifiedOnDate', header: 'Lần thay đổi cuối' },
                    { field: 'FileCates', header: 'Thể loại' }
                ];
            }
            else {

            }
        });

        this._cate.getAllGroup().subscribe(res => {
            if (res.Status == 1) {
                this.dm_groupcates = [];
                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_groupcates.push({
                        value: res.Data[i].DocumentCateGroupId,
                        label: res.Data[i].Name
                    });
                }
                if (this.dm_groupcates.length > 0) {
                    this.dm_cates = [];
                    this.dm_cates.push({
                        value: null,
                        label: "Tất cả"
                    });
                    this.cates = [];
                    this._cate.getAll().subscribe(res1 => {
                        if (res1.Status == 1) {
                            for (let i = 0; i < res1.Data.length; i++) {
                                //this.cates = [...this.cates, { value: res.Data[i].CategoryId, label: res.Data[i].Name }];
                                this.dm_cates.push({ value: res1.Data[i].CategoryId, label: res1.Data[i].Name });
                                this.cates = [...this.cates, { value: res1.Data[i].CategoryId, label: res1.Data[i].Name }];
                            }
                        }
                    });
                }

            }
        })
        this._department.getAll().subscribe(res => {
            for (let i = 0; i < res.Data.length; i++) {
                this.dm_departments.push({
                    value: res.Data[i].DepartmentId,
                    label: res.Data[i].Name
                });
            }
            //  this.docs = this.docs.filter((val, j) => j != index);
            this.dm_departments = this.dm_departments.filter(d => d.value != this.crnt_user.DepartmentId);

        })



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
        this.users = [];
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
        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));

        this.folder = this.crnt_user.UserId + '_' + new Date().valueOf();
        this.menu_context = [
            {
                label: 'Tạo thư mục',
                icon: 'fas fa-plus',
                command: (event) => {
                    if (this.selectedNode.data != 0) {
                        if (this.selectedNode) {
                            this.openCreateDir({
                                ParentId: this.selectedNode.data,
                                ModuleId: 0
                            });
                        }
                        else {
                            this.openCreateDir({
                                ParentId: 0,
                                ModuleId: 0
                            });
                        }
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
        this.directories = [];
        this.directories.push({
            value: null,
            label: 'Thư mục gốc'
        });
        if (this.crnt_user.DepartmentId != 0) {
            this.directories.push({
                value: 0,
                label: 'Phòng văn thư'
            });
        }
        this.loadNodes();

    }
    expandAll() {
        this.dirs.forEach(node => {
            node.expanded = true;
        });
    }
    OpenCreate() {

        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 2) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {



            this.mainModel = {};
            this.mainModel.CreatedOnDate = new Date();
            this.mainModel.LastModifiedOnDate = new Date();
            this.mainModel.Name = this.uploadFile.name.substr(0, this.uploadFile.name.lastIndexOf('.'));
            this.mainModel.CreatedByUserId = this.crnt_user.UserId;
            this.selectedCate = {};
            this.selectedCate.items = [];
            this.selectedCate.strings = [];
            //
            this.displayCreate_1 = false;
            this.displayCreate = true;

        }


    }
    nodeSelect(event) {
        this.selectedNode = event.node;
        if (event.node.data != null) {
            if (event.node.data == 0) {
                this._service.getAllShares().subscribe(res => {
                    if (res.Status == 1) {
                        this.docs = [];
                        this.docs = res.Data;
                    }
                });
            }
            else {


                this._service.getAllInDirectory(parseInt(event.node.data)).subscribe(res => {
                    if (res.Status == 1) {
                        this.docs = [];
                        this.docs = res.Data;
                    }
                });
            }
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

    OpenUpdate(item: any) {
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 2) {
            let data = {};
            data = {
                reason: 'Bạn không có quyển thực hiện hành động này',
                status: null
            };
            this.errorDialogService.show(data);
        }
        else {
            this.selectedFile = item;
            this._service.getById(item.DocumentId).subscribe(res => {
                if (res.Status == 1) {
                    this.mainModel = res.Data;
                    this.updateModel = {};
                    this.updateModel.Name = this.mainModel.Name;
                    this.updateModel.Description = this.mainModel.Description;
                    this.updateModel.DirectoryId = this.mainModel.DirectoryId;
                    this.updateModel.FileCates = this.mainModel.FileCates;
                    this.updateModel.CreatedByUserId = this.mainModel.CreatedByUserId;
                    this.updateModel.DocumentType = this.mainModel.DocumentType;
                    this.mainModel.CreatedOnDate = new Date(this.mainModel.CreatedOnDate);
                    this.mainModel.LastModifiedOnDate = new Date(this.mainModel.LastModifiedOnDate);
                    let str = this.updateModel.FileCates;
                    let str_arr = str.split(',').filter(i => i);
                    let results = this.cates.filter(c => str_arr.includes(c.value.toString()));
                    this.selectedCate = {};
                    this.selectedCate.items = [];
                    this.selectedCate.strings = [];
                    results.forEach(element => {
                        this.selectedCate.items.push({
                            value: element.value,
                            label: element.label
                        })
                    });
                    this.selectedCate.strings = this.getString(this.selectedCate.items);
                    this.displayUpdateDialog = true;
                }
            })
        }
    }
    OpenDetail(item: any) {
        this.selectedFile = item;
        this.displayDetail = true;
    }
    getString(arr: any[]) {
        let strings: string[] = [];
        for (let i = 0; i < arr.length; i++) {
            strings.push(arr[i].label);
        }
        return strings;
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
        else {
            this.confirmationService.confirm({
                message: 'Bạn chắc chắn muốn xóa dòng này chứ?',
                header: 'Xác nhận hành động',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service.Delete(item.DocumentId).subscribe(res => {
                        if (res.Status == 1) {
                            let index = this.docs.indexOf(this.selectedFile);
                            this.docs = this.docs.filter((val, j) => j != index);
                            this.messageService.add({ severity: 'success', summary: 'Xóa thành công', detail: 'Tệp đã được xóa thành công' });
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
    OnSelectFile(event) {
        let f = event.files[0];
        if (f.size > 10000000) {
            this.messageService.add({ severity: 'error', summary: 'Chọn tệp không thành công', detail: 'File quá lớn' });
        }
    }
    OnUploading(event, value) {

    }
    myUploader(event, file_input) {
        let f = event.files[0];
        this.uploadFile = f;
        this.OpenCreate();
        file_input.clear();
        // let f=event.files[0];
        // this.uploadFile=f;
        // this.progressRef.start();
        // this.progressRef.complete();
        // this.progressRef.setConfig({ color: 'green' });
        // let f=event.files[0];
        // this._upload.UploadFile(this.folder, event.files).subscribe(
        //     res => {
        //         if (res.status) {
        //             this.uploadFile= uploadUrl+'/'+ res.result[0].Value;
        //             this.OpenCreate(f);
        //         }
        //     },
        //     error => {
        //         console.log(error);
        //     }
        // )

    }
    previewFile() {
        var a = document.createElement("a"),
            url = URL.createObjectURL(this.uploadFile);
        a.href = url;
        a.download = this.uploadFile.name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
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
                header: 'Tạo thư mục tệp',
                width: '500px',
                data: data
            });

            ref.onClose.subscribe((newDir: any) => {
                if (newDir) {
                    this.directories.push({
                        value: newDir.DirectoryId,
                        label: newDir.Name
                    });
                    this.mainModel.DirectoryId = newDir.DirectoryId;
                    this.loadNodes();
                    this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thư mục mới: ' + newDir.Name });
                }
            });
        }
    }
    openSelectDir() {
        const ref = this.dialogService.open(SelectDirectoryComponent, {
            header: 'Danh sách các thư mục',
            width: '500px'
        });

        ref.onClose.subscribe((item: any) => {
            if (item) {
                this.createSelectedDir = item;
                this.mainModel.DirectoryId = item.value;
                // this.loadNodes();
                // this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thư mục mới: ' + newDir.Name });
            }
        });
    }
    openSelectCate() {
        const ref = this.dialogService.open(SelectCategoryComponent, {
            header: 'Thể loại tài liệu',
            width: '500px',
            data: this.selectedCate
        });

        ref.onClose.subscribe((item: any) => {
            if (item) {
                this.selectedCate = item;
                console.log(this.selectedCate);
                // this.cates = [...this.cates, { value: newCate.CategoryId, label: newCate.Name }];
                // this.selectedCates.push({
                //     value: newCate.CategoryId,
                //     label: newCate.Name
                // })

                //this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thể loại mới: ' + newCate.Name });
            }
        });
    }
    create() {
        if (this.mainModel.DirectoryId == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Bạn chưa chọn thư mục lưu' });
        }
        else if (this.selectedCate.items.length == 0) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Bạn chưa chọn thể loại tài liệu' });
        }
        else {


            this.createModel = {
                CreatedByUserId: this.crnt_user.UserId,
                FileCates: this.buidStringCates(this.selectedCate.items),
                Name: this.mainModel.Name,
                DirectoryId: this.mainModel.DirectoryId,
                Description: this.mainModel.Description,
                FileUrl: "",
                DocumentType: this.mainModel.DocumentType
            };
            //upload attach file
            this._upload.UploadFile(this.folder, [this.uploadFile]).subscribe(
                res => {
                    if (res.status) {
                        this.createModel.FileUrl = uploadDataUrl + '/' + res.result[0].Value;
                        this._service.Create(this.createModel).subscribe(res1 => {
                            if (res1.Status == 1) {

                                this._service.getAll().subscribe(res => {
                                    if (res.Status == 1) {
                                        this.docs = res.Data;
                                        this.cols = [
                                            { field: 'Name', header: 'Tên gọi' },
                                            { field: 'CreatedByUserName', header: 'Tác giả' },
                                            { field: 'LastModifiedOnDate', header: 'Lần thay đổi cuối' },
                                            { field: 'FileCates', header: 'Thể loại' }
                                        ];
                                    }
                                    else {

                                    }
                                });
                                this.displayCreate = false;
                                this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Tệp vừa tạo: ' + res1.Data.Name });
                            }
                        })
                    }
                },
                error => {
                    console.log(error);
                }
            )
        }
    }
    update() {
        this._service.Update(this.selectedFile.DocumentId, this.updateModel).subscribe(res => {
            if (res.Status == 1) {
                this.displayUpdateDialog = false;
                this.docs = [];
                this._service.getAll().subscribe(res => {
                    if (res.Status == 1) {
                        this.docs = res.Data;
                    }
                    else {

                    }
                });

                this.messageService.add({ severity: 'info', summary: 'Thay đổi thành công', detail: 'Thông tin tệp đã được thay đổi thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Thay đổi không thành công', detail: 'Chi tiết: ' + res.Message });
            }
        })
    }
    buidStringCates(list: any[]) {

        let str = "";
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].value + ',';
        };
        if (list.length > 0) str = str.substr(0, str.lastIndexOf(','));
        return str;
    }
    showCateItem(event: any, cate: any, overlaypanel: OverlayPanel) {
        let str = cate.FileCates;
        let str_arr = str.split(',').filter(i => i);
        let results = this.cates.filter(c => str_arr.includes(c.value.toString()));
        this.SelectedCateItem = results;
        this.selectedFile = cate;
        overlaypanel.toggle(event);
    }
    getCateString(str: string) {
        let _str = '';
        let str_arr = str.split(',').filter(i => i);
        let results = this.cates.filter(c => str_arr.includes(c.value.toString())).filter(function (el) { return el; });
        for (let i = 0; i < results.length; i++) {
            _str += results[i].label + ',';
        }
        return _str;
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
    OnAdd(event: any) {
        this.selectedCate.strings.pop();
    }
    OnRemove(event: any) {
        var item = this.selectedCate.items.filter(c => c.label === event.value)[0];
        let index = this.selectedCate.items.indexOf(item);
        this.selectedCate.items = this.selectedCate.items.filter((val, j) => j != index);

        this.selectedCate.strings = [];
        for (let i = 0; i < this.selectedCate.items.length; i++) {
            this.selectedCate.strings.push(this.selectedCate.items[i].label);
        }

    }
    ShareDocument() {
        if (this.dm_departments && this.dm_departments.length > 0) {
            this.ShareDocumentModel.DepartmentId = this.dm_departments[0].value;
        }
        this.displayShare = true;
    }
    share() {
        this.ShareDocumentModel.DocumentId = this.selectedFile.DocumentId;
        this._service.ShareDocument(this.ShareDocumentModel).subscribe(res => {
            if (res.Status == 1) {
                this.displayShare = false;
                this.ShareDocumentModel = {};
                this.selectedFile = null;
                this.messageService.add({ severity: 'info', summary: 'Gửi tài liệu thành công' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Gửi tài liệu không thành công' });
            }
        })
    }
}
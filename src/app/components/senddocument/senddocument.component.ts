import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { SendDocumentService } from './senddocument.service';
import { BaseSendDocumentModel, SendDocumentDisplayModel, SendDocumentModel } from './senddocument';
import { BusinessPartnerService } from '../businesspartner/businesspartner.service';
import { DialogService } from 'primeng/api';
import { CreateDocUnifyComponent } from '../DocumentUnify/create/createunify.component';
import { CreateDocConfirmComponent } from '../documentconfirm/create/createconfirm.component';
import { Module, TaskType } from '../home/taskmessage';
import { DocumentStatusService } from '../documentstatus/documentstatus.service';
import { DocumentStatusModel } from '../documentstatus/documentstatus';
import { CreateProcessComponent } from '../documentprocess/create/createprocess.component';
import { DocumentProcessService } from '../documentprocess/documentprocess.service';
import { DetailProcessComponent } from '../documentprocess/detail/detailprocess.component';
import { ErrorDialogService } from '../shared/error/dialog/errordialog.service';
@Component({
    templateUrl: './senddocument.component.html',
    styleUrls: ['./senddocument.component.css'],
    providers: [
        SendDocumentService,
        BusinessPartnerService,
        DialogService,
        MessageService,
        DocumentStatusService,
        ConfirmationService,
        DocumentProcessService,
        ErrorDialogService
    ]
})
export class SendDocumentComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    cols: any[];
    selectedDoc: SendDocumentDisplayModel;
    docs: SendDocumentDisplayModel[];
    dm_partners: SelectItem[];
    process_methods: MenuItem[];
    constructor(
        private _service: SendDocumentService,
        private _partner: BusinessPartnerService,
        public dialogService: DialogService,
        private messageService: MessageService,
        private _status: DocumentStatusService,
        private confirmationService: ConfirmationService,
        private _process: DocumentProcessService,
        private errorDialogService: ErrorDialogService
    ) {


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
                                DocumentId: this.selectedDoc.SendDocumentId,
                                ModuleType: Module.SEND
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
    }
    CheckCurrentProcess(Id: number) {
        this._process.getActive(Id).subscribe(res => {
            if (res.Status == 1) {

            }

        });
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
                                    Id: this.selectedDoc.SendDocumentId,
                                    Module: Module.SEND,
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
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục thể loại tài liệu' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this._service.getAll().subscribe(res => {
            if (res.Status == 1) {
                this.docs = res.Data;
                this.cols = [
                    { field: 'Name', header: 'Tên gọi' },
                    { field: 'ResignedNumber', header: 'Số đăng ký' },
                    { field: 'ResignedOnDate', header: 'Ngày đăng ký' },
                    { field: 'Receiver', header: 'Người nhận' },
                    { field: 'SignedByUserFullName', header: 'Người ký' },
                    { field: 'CreatedOnDate', header: 'Ngày tạo' }
                ];
            }
        });
        this.dm_partners = [];
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

    }
    CheckStatus(item: SendDocumentDisplayModel) {
    }
    OpenDetail(item) {
        this._service.getById(item.SendDocumentId).subscribe(res => {
            if (res.Status == 1) {

            }
        })
    }
    CreateAutoProcess() {
        this.confirmationService.confirm({
            message: 'Bạn chắc chắn muốn áp dụng quy trình mẫu để xử lý tài liệu này?',
            header: 'Xác nhận hành động',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.selectedDoc) {
                    if (!this.selectedDoc.ResignedNumber) {
                        this._process.CreateAuto(this.selectedDoc.SendDocumentId, Module.SEND).subscribe(res => {
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
                    this._service.Delete(item.SendDocumentId).subscribe(res => {
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
}
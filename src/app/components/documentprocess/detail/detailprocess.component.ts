import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, DialogService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { DocumentProcessCreateModel, DocumentProcessModel, ProcessType } from '../documentprocess';
import { DocumentProcessService } from '../documentprocess.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { TaskType, Module } from '../../home/taskmessage';
import { CreateDocConfirmComponent } from '../../documentconfirm/create/createconfirm.component';
import { CreateDocUnifyComponent } from '../../DocumentUnify/create/createunify.component';
import {CreateDocPerformComponent} from '../../DocumentPerform/create/createperform.component';
import { SendDocumentService } from '../../senddocument/senddocument.service';
@Component({
    templateUrl: './detailprocess.component.html',
    styleUrls: ['./detailprocess.component.css'],
    providers: [
        DocumentProcessService,
        MessageService,
        DialogService,
        ConfirmationService,
        SendDocumentService
    ],
    encapsulation: ViewEncapsulation.None
})
export class DetailProcessComponent implements OnInit {
    processes: DocumentProcessModel[] = [];
    Id: number;
    Active: DocumentProcessModel;
    Next: DocumentProcessModel;
    DocInfo: any;
    finished: boolean = false;
    isStarted: boolean = false;
    dialogRegister: boolean = false;
    constructor(
        private _service: DocumentProcessService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        private _router: Router,
        private dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private _send: SendDocumentService
    ) {
        this.Id = config.data.Id;
        this.DocInfo = config.data.Doc;
    }
    ngOnInit() {
        this._service.getAllProcess(this.Id).subscribe(res => {
            if (res.Status == 1) {
                this.processes = res.Data;
                if (this.processes.filter(p => p.Status < 1).length == this.processes.length) {
                    if (this.processes.length > 1) {
                        this.Active = this.processes[0];
                        this.isStarted = true;
                        this.Next = this.processes[1];
                    }
                    else if(this.processes.length==1){
                        this.isStarted = true;
                        this.Active = this.processes[0];
                    }
                }
                this.GetCurrent();
            }
        })
    }
    GetCurrent() {
        this._service.getActive(this.Id).subscribe(res1 => {
            if (res1.Status == 1) {
                this.Active = res1.Data;
                this.GetNext();
            }
        })
    }
    GetNext() {
        this._service.getNext(this.Id).subscribe(res => {
            if (res.Status == 1) {
                this.Next = res.Data;

            }
            else if (res.Status == 0) {

                if (this.Active.Status == 2) this.finished = true;

            }
        })
    }
    Save() {


    }
    getTaskName(Id: number) {
        switch (Id) {
            case TaskType.UNIFY: {
                return "Thống nhất";
            }
            case TaskType.CONFIRM: {
                return "Phê duyệt";
            }
            case TaskType.REGISTER: {
                return "Đăng ký";
            }
            case TaskType.PERFORM: {
                return "Thực hiện";
            }
        }
    }
    getClass(Status: number) {
        switch (Status) {
            case ProcessType.INPROCESS: {
                return "alert-success";
            }
            case ProcessType.FINISHED: {
                return "alert-danger";
            }
            case ProcessType.NOTSET: {
                return "alert-dark";
            }
            case ProcessType.WAITING: {
                return "alert-warning";
            }
        }
    }
    OpenDetail(item: DocumentProcessModel) {
        if (item.RelatedId != -1) {
            this.ref.close();
           
            switch (item.TaskType) {
                case TaskType.UNIFY: {
                    this._router.navigate(['/ket-qua-thong-nhat/', item.RelatedId]);
                    break;
                }
                case TaskType.CONFIRM: {
                    this._router.navigate(['/ket-qua-phe-duyet/', item.RelatedId]);
                    break;
                }
                case TaskType.PERFORM: {
                    this._router.navigate(['/ket-qua-thuc-hien/', item.RelatedId]);
                    break;
                }
                case TaskType.REGISTER: {
                    if (this.DocInfo.Module == Module.SEND) {
                        this._router.navigate(['/van-ban-di/chi-tiet/', this.DocInfo.Id]);
                    }
                    else if(this.DocInfo.Module == Module.RECEIVE) {
                        this._router.navigate(['/van-ban-den/chi-tiet/', this.DocInfo.Id]);
                    }
                    else if(this.DocInfo.Module == Module.INTERNAL) {
                        this._router.navigate(['/van-ban-noi-bo/chi-tiet/', this.DocInfo.Id]);
                    }
                    break;
                }
            }
        }
        else {
            alert('Nhiệm vụ chưa bắt đầu');
        }
    }
    ActiveNext() {
        if (this.Active.Status == 2) {
            switch (this.Next.TaskType) {
                case TaskType.CONFIRM: {
                    this.StartConfirm();
                    break;
                }
                case TaskType.REGISTER: {
                    this.StartRegister();
                    break;
                }
                case TaskType.UNIFY: {
                    this.StartUnify();
                    break;
                }
                case TaskType.PERFORM: {
                    this.StartPerform();
                    break;
                }
            }
        }
    }
    ActiveFirst() {

        switch (this.Active.TaskType) {
            case TaskType.CONFIRM: {
                this.StartConfirm();
                break;
            }
            case TaskType.REGISTER: {
                this.StartRegister();
                break;
            }
            case TaskType.UNIFY: {
                this.StartUnify();
                break;
            }
            case TaskType.PERFORM: {
                this.StartPerform();
                break;
            }
        }

    }
    StartUnify() {
        const ref = this.dialogService.open(CreateDocUnifyComponent, {
            header: 'thống nhất văn bản đi',
            width: '500px',
            data: {...this.DocInfo, ...{TaskType:TaskType.UNIFY}}
        });

        ref.onClose.subscribe((res: any) => {
            if (res) {
                if (res.Status == 1) {

                    let processes = [...this.processes];
                    let tmp = this.Active;
                    tmp.Status = ProcessType.INPROCESS;
                    processes[this.processes.indexOf(this.Active)] = tmp;
                    this.processes = processes;
                    this.GetNext();
                    this.Active = tmp;

                    this.messageService.add({ severity: 'info', summary: 'Gửi yêu cầu thống nhất thành công' });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Gửi yêu cầu thống nhất không thành công', detail: 'Chi tiết: ' + res.Message });
                }


            }
        });
    }
    StartPerform() {
        const ref = this.dialogService.open(CreateDocPerformComponent, {
            header: 'Thực hiện văn bản',
            width: '500px',
            data: {...this.DocInfo, ...{TaskType:TaskType.PERFORM}}
        });

        ref.onClose.subscribe((res: any) => {
            if (res) {
                if (res.Status == 1) {

                    let processes = [...this.processes];
                    let tmp = this.Active;
                    tmp.Status = ProcessType.INPROCESS;
                    processes[this.processes.indexOf(this.Active)] = tmp;
                    this.processes = processes;
                    this.GetNext();
                    this.Active = tmp;

                    this.messageService.add({ severity: 'info', summary: 'Gửi yêu cầu thực hiện thành công' });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Gửi yêu cầu thực hiện không thành công', detail: 'Chi tiết: ' + res.Message });
                }


            }
        });
    }
    StartConfirm() {
        const ref = this.dialogService.open(CreateDocConfirmComponent, {
            header: 'Phê duyệt văn bản đi',
            width: '500px',
            data: {...this.DocInfo, ...{TaskType:TaskType.CONFIRM}}
        });

        ref.onClose.subscribe((res: any) => {
            if (res) {
                if (res.Status == 1) {

                    let processes = [...this.processes];
                    let tmp = this.Active;
                    tmp.Status = ProcessType.INPROCESS;
                    processes[this.processes.indexOf(this.Active)] = tmp;
                    this.processes = processes;
                    this.GetNext();
                    this.Active = tmp;

                    this.messageService.add({ severity: 'info', summary: 'Gửi yêu cầu phê duyệt thành công' });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Gửi yêu cầu phê duyệt không thành công', detail: 'Chi tiết: ' + res.Message });
                }


            }
        });
    }
    StartRegister() {
        this.dialogRegister = true;

    }
    DoRegister() {
        if (this.Active.Status == 2) {
            if (this.Next.TaskType == TaskType.REGISTER) {
                this._service.ChangeStatus(this.Id, this.Next.OrderIndex, this.DocInfo.Id, ProcessType.INPROCESS).subscribe(
                    res => {
                        if (res.Status == 1) {

                            let processes = [...this.processes];
                            let tmp = this.Active;
                            tmp.Status = ProcessType.INPROCESS;
                            processes[this.processes.indexOf(this.Active)] = tmp;
                            this.processes = processes;
                            this.Active = tmp;

                            this.dialogRegister = false;
                            this.messageService.add({ severity: 'info', summary: 'Bắt đầu quá trình đăng ký thành công', detail: 'Truy cập chi tiết tài liệu để thực hiện đăng ký' });
                            this.ref.close();
                            this.GetNext();
                        }
                        else this.messageService.add({ severity: 'error', summary: 'Gửi yêu cầu phê duyệt không thành công', detail: 'Chi tiết: ' + res.Message });
                    }

                )
            }
        }
    }
}
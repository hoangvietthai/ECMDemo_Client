import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { DocumentUnifyModel, DocumentUnifyResponseDisplayModel, DocumentUnifyReCreateModel, FinishUnifyModel } from '../documentunify';
import { DocumentUnifyService } from '../documentunify.service';
import { UserService } from '../../user/user.service';
import { DialogService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SendDocumentService } from '../../senddocument/senddocument.service';

import { ReceivedDocumentService } from '../../receiveddocument/receiveddocument.service';
import { InternalDocumentService } from '../../internaldocument/internaldocument.service';
import { uploadDataUrl } from '../../../app.global';
import { BusinessPartnerService } from '../../businesspartner/businesspartner.service';
import { Module } from '../../home/taskmessage';
import { DocumentStatusUpdateModel, StatusType, DocumentStatusModel } from '../../documentstatus/documentstatus';
import { DocumentStatusService } from '../../documentstatus/documentstatus.service';
@Component({
    templateUrl: './resultdocumentunify.component.html',
    providers: [
        DocumentUnifyService,
        MessageService,
        UserService,
        DialogService,
        SendDocumentService,
        BusinessPartnerService,
        DocumentStatusService,
        ConfirmationService,
        ReceivedDocumentService,
        InternalDocumentService
    ],
    styleUrls: ['./resultdocumentunify.component.css']
})
export class ResultDocUnifyComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    display: boolean = false;
    files_of_doc: any[];
    folder: string;
    crnt_user: any;
    private sub: any;
    Id: number;
    mainModel: DocumentUnifyModel;
    documentModel: any;
    uploadDataUrl: string = uploadDataUrl;
    isShowActions: boolean = true;
    dm_users: SelectItem[];
    dm_partners: SelectItem[];
    InvokeUsers: SelectItem[];
    Author: SelectItem;
    dm_priories: SelectItem[];
    displayReUnify: boolean = false;
    responses: DocumentUnifyResponseDisplayModel[];
    tmp_responses: DocumentUnifyResponseDisplayModel[] = [];
    finalResult: boolean = true;
    ReSendModel: DocumentUnifyReCreateModel;
    FinishModel: FinishUnifyModel = {};
    current_status: DocumentStatusModel;
    constructor(
        private _service: DocumentUnifyService,
        public messageService: MessageService,
        public _user: UserService,
        public dialogService: DialogService,
        private _router: ActivatedRoute,
        private _send: SendDocumentService,
        private _partner: BusinessPartnerService,
        private _status: DocumentStatusService,
        private confirmationService: ConfirmationService,
        private _receive: ReceivedDocumentService,
        private _internal: InternalDocumentService
    ) {
        this.BreadcrumbItems = [
            { label: 'Thống nhất văn bản', url: '' },
            { label: 'Kết quả' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this.dm_priories = [];
        this.dm_priories.push({
            value: 1,
            label: 'Thường'
        });
        this.dm_priories.push({
            value: 2,
            label: 'Quan trọng thấp'
        });
        this.dm_priories.push({
            value: 3,
            label: 'Quan trọng cao'
        });

        this.crnt_user = JSON.parse(localStorage.getItem('ssuser'));
        this.folder = this.crnt_user.UserId + '/' + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf();
        this.ReSendModel = {
            ExtraDays: 1,
            Message: '',
            UserId: this.crnt_user.UserId
        };
        this.FinishModel.UserId = this.crnt_user.UserId;
    }
    ngOnInit() {
        this.sub = this._router.params.subscribe(params => {
            this.Id = params['Id'];
            this._service.getById(this.Id).subscribe(res => {
                if (res.Status == 1) {
                    this.mainModel = res.Data;
                    this.ReSendModel.ModuleId = this.mainModel.ModuleId;
                    if(this.mainModel.CreatedByUserId!=this.crnt_user.UserId){
                        this.isShowActions=false;
                    }
            
                    this._service.GetAllResponses(this.Id).subscribe(res1 => {
                        if (res1.Status == 1) {
                            this.tmp_responses = res1.Data;
                        }
                    })
                    console.log(this.mainModel)
                    switch (this.mainModel.ModuleId) {
                        case Module.SEND: {
                            this._send.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                if (doc.Status == 1) {

                                    this.documentModel = doc.Data;
                                    this.FinishModel.ProcessId = this.documentModel.DocumentProcessId;
                                    this.documentModel.AttachedFileUrl;
                                    this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    this._status.getById(this.documentModel.DocumentStatusId).subscribe(st => {
                                        if (st.Status == 1) {
                                            this.current_status = st.Data;
                                        }
                                    })
                                }
                            })
                            break;
                        }
                        case Module.RECEIVE: {
                            this._receive.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                if (doc.Status == 1) {
                                    this.documentModel = doc.Data;
                                    this.FinishModel.ProcessId = this.documentModel.DocumentProcessId;
                                    this.documentModel.AttachedFileUrl;
                                    this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    this._status.getById(this.documentModel.DocumentStatusId).subscribe(st => {
                                        if (st.Status == 1) {
                                            this.current_status = st.Data;
                                        }
                                    })
                                }
                            });
                            break;
                        }
                        case Module.INTERNAL: {
                            this._internal.getById(this.mainModel.RelatedDocumentId).subscribe(doc => {
                                if (doc.Status == 1) {
                                    this.documentModel = doc.Data;
                                    this.FinishModel.ProcessId = this.documentModel.DocumentProcessId;
                                    this.documentModel.AttachedFileUrl;
                                    this.files_of_doc = this.documentModel.AttachedFileUrl.split(',').filter(n => n);
                                    this._status.getById(this.documentModel.DocumentStatusId).subscribe(st => {
                                        if (st.Status == 1) {
                                            this.current_status = st.Data;
                                        }
                                    })
                                }
                            });
                            break;
                        }
                    }

                    this._user.getAllBase().subscribe(res => {
                        this.dm_users = [];
                        if (res.Status == 1) {
                            for (let i = 0; i < res.Data.length; i++) {
                                this.dm_users.push({
                                    label: res.Data[i].UserName,
                                    value: res.Data[i].UserId
                                });
                            }
                            this._partner.getAll().subscribe(res1 => {
                                this.dm_partners = [];
                                if (res1.Status == 1) {
                                    for (let i = 0; i < res1.Data.length; i++) {
                                        this.dm_partners.push({
                                            value: res1.Data[i].PartnerId,
                                            label: res1.Data[i].Name
                                        });
                                    }
                                }
                                this.InvokeUsers = this.GetUsers(this.mainModel.UserList);
                                this.Author = this.dm_users.filter(u => u.value == this.mainModel.CreatedByUserId)[0];
                                this.ABC();
                            })
                        }
                    })
                }
            })

        })
        // this.files_of_doc = this.updateModel.AttachedFileUrl.split(',').filter(n => n);
    }
    save() {
        //    // console.log(this.responseModel);
        //     this._service.SendResponse(this.responseModel).subscribe(res=>{
        //         if(res.Status==1){
        //             this.messageService.add({ severity: 'info', summary: 'Phản hồi thành công' });
        //             this.isShowActions=false;
        //         }
        //         else{
        //             this.messageService.add({ severity: 'error', summary: 'Phản hồi không thành công' });
        //         }
        //     })
    }
    StatusName(num: number) {
        if (num == 1) return 'Đã thống nhất';
        if (num == 0) return 'Không thống nhất';
        if (num == -1) return 'Chưa thực hiện thống nhất';
    }
    GetPartnerName(id: number) {
        let tmp = this.dm_partners.filter(p => p.value == id)[0];
        if (tmp) return tmp.label;
        else return '';
    }
    GetUsers(str: string) {
        let list_return: SelectItem[] = [];
        let list_id = str.split(',').filter(s => s);
        for (let i = 0; i < list_id.length; i++) {
            let num_id = parseInt(list_id[i]);
            list_return.push(this.dm_users.filter(u => u.value == num_id)[0]);
        }
        return list_return;
    }
    IsExpired() {
        return (new Date(this.mainModel.FinishedOnDate).getTime() < new Date().getTime());
    }
    GetPriority(Id: number) {

        let tmp = this.dm_priories.filter(p => p.value == Id)[0];
        if (tmp) return tmp.label;
        else return '';
    }
    ABC() {
        let missings: DocumentUnifyResponseDisplayModel[] = [];
        for (let i = 0; i < this.InvokeUsers.length; i++) {
            let tmp = this.tmp_responses.filter(u => u.UserId == this.InvokeUsers[i].value)[0];
            if (tmp) {
                if (tmp.ResponseStatus != 1) this.finalResult = false;
            }
            else {
                missings.push({
                    UserId: this.InvokeUsers[i].value,
                    UserName: this.InvokeUsers[i].label,
                    ResponseStatus: -1
                });
                this.finalResult = false;
            }

        }
        this.responses = [...this.tmp_responses, ...missings];
    }
    Finish() {
        if (!this.IsExpired()) {
            this.confirmationService.confirm({
                message: 'Qúa trình thống nhất vẫn trong thời gian? Bạn chắc chắn muốn kết thúc ngay chứ?',
                header: 'Xác nhận hành động',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.RealFinish();
                },
                reject: () => {

                }
            });
        }
        else {
            this.RealFinish();
        }
    }
    RealFinish() {
        let result = this.finalResult ? StatusType.ACCEPTED : StatusType.REJECTED;
        this.FinishModel.Status = result;
        this._service.Finish(this.Id, this.FinishModel).subscribe(res => {
            if (res.Status == 1) {
                let updateStatusModel: DocumentStatusUpdateModel = {
                    UnifyStatus: result,
                    ConfirmStatus: this.current_status.ConfirmStatus,
                    PerformStatus: this.current_status.PerformStatus,
                    RegisterStatus: this.current_status.RegisterStatus,
                    ConfirmRelatedId: this.current_status.ConfirmRelatedId,
                    PerformRelatedId: this.current_status.PerformRelatedId,
                    RegisterRelatedId: this.current_status.RegisterRelatedId,
                    UnifyRelatedId: this.mainModel.UnifyId,
                    DisplayName: result == 1 ? 'Đã thống nhất' : 'Không thống nhất'
                };

                this._status.Update(this.current_status.Id, updateStatusModel).subscribe(res1 => {
                    if (res1.Status == 1) {
                        this.messageService.add({ severity: 'info', summary: 'Đã kết thúc thống nhất' });
                        this.isShowActions = false;
                        this.mainModel.IsFinished = 1;
                    }
                    else {
                        this.messageService.add({ severity: 'warn', summary: 'Đã kết thúc thống nhất', detail: 'Thay đổi trạng thái tài liệu không thành công' });
                        this.isShowActions = false;
                    }
                })

            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Kết thúc thống nhất không thành công' });
            }
        })
    }
    ReSend() {
        if (!this.IsExpired()) {
            this.confirmationService.confirm({
                message: 'Qúa trình thống nhất vẫn trong thời gian? Bạn chắc chắn gửi yêu cầu thống nhất lại chứ?',
                header: 'Xác nhận hành động',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.RealReSend();
                },
                reject: () => {

                }
            });
        }
        else {
            this.RealReSend();
        }
    }
    RealReSend() {
        this._service.ReCreate(this.Id, this.ReSendModel).subscribe(res => {
            if (res.Status == 1) {
                this.messageService.add({ severity: 'info', summary: 'Đã gửi yêu cầu thống nhất lại' });
                this.isShowActions = false;
                this.displayReUnify = false;
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Gửi yêu cầu thống nhất lại không thành công' });
            }
        })
    }
    UpdateStatus(num: number) {

    }
}
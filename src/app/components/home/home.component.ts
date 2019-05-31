import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from './home.service';
import { PendingTaskModel, PendingTaskDetailModel, ExpiredTaskModel, TaskMessageModel, TaskMessageDisplayModel, TaskType, Module } from './taskmessage';
import { DocumentModel } from '../document/document';
import { DocumentService } from '../document/document.service';
import { Router } from '@angular/router';
import { DocumentCateService } from '../categories/category.service';
import { SendDocumentService } from '../senddocument/senddocument.service';
import { ReceivedDocumentService } from '../receiveddocument/receiveddocument.service';
import { InternalDocumentService } from '../internaldocument/internaldocument.service';
import { from } from 'rxjs';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    HomeService,
    DocumentService,
    DocumentCateService,
    SendDocumentService,
    ReceivedDocumentService,
    InternalDocumentService
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  send_expired_tasks: TaskMessageDisplayModel[] = [];
  send_process_tasks: TaskMessageDisplayModel[] = [];
  receive_expired_tasks: TaskMessageDisplayModel[] = [];
  receive_process_tasks: TaskMessageDisplayModel[] = [];
  interval_expired_tasks: TaskMessageDisplayModel[] = [];
  interval_process_tasks: TaskMessageDisplayModel[] = [];
  mytasks: TaskMessageDisplayModel[] = [];
  private_documents: DocumentModel[] = [];
  public_documents: DocumentModel[] = [];
  selected_tasks: TaskMessageDisplayModel[];
  selected_docs: DocumentModel[] = [];
  selectedDoc: DocumentModel;
  count_send: any;
  count_recei: any;
  count_internal: any;
  selectedTask: TaskMessageDisplayModel;
  displayTaskDialog: boolean = false;
  displayDocDialog: boolean = false;
  displayDocDetail: boolean = false;
  cates: any[];
  public user: any;
  pendingtasks: PendingTaskModel[];
  expiredtasks: ExpiredTaskModel[];
  constructor(
    private _task: HomeService,
    private _doc: DocumentService,
    private _router: Router,
    private _cate: DocumentCateService,
    private _send: SendDocumentService,
    private _recei: ReceivedDocumentService,
    private _internal: InternalDocumentService
  ) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("ssuser"));
    if (this.user.UserRole == 1 || this.user.UserRole == 2) {
      this._task.getPendingTasks().subscribe(res => {
        if (res.Status == 1) {
          this.pendingtasks = res.Data;
        }
      });
      this._task.getExpiredTasks().subscribe(res => {
        if (res.Status == 1) {
          this.expiredtasks = res.Data;
        }
      })
    }
    this._send.getAll().subscribe(res => {
      if (res.Status == 1) {
        this.count_send = res.Data.length;
      }
    });
    this._recei.getAll().subscribe(res => {
      if (res.Status == 1) {
        this.count_recei = res.Data.length;
      }
    });
    this._internal.getAll().subscribe(res => {
      if (res.Status == 1) {
        this.count_internal = res.Data.length;
      }
    });
    this.GetMessages();
    this._doc.getAll().subscribe(res => {
      if (res.Status == 1) {
        this.private_documents = res.Data.filter(d => d.DocumentType);
        this.public_documents = res.Data.filter(d => !d.DocumentType);
      }
    })
    this._cate.getAllGroup().subscribe(res => {
      if (res.Status == 1) {
        this.cates = [];
        for (let i = 0; i < res.Data.length; i++) {
          this.cates.push({
            value: res.Data[i].DocumentCateGroupId,
            label: res.Data[i].Name
          });
        }

      }
    });
  }
  GetExpires(list: TaskMessageDisplayModel[]) {
    let reuslt: any[] = [];
    let today = new Date();
    reuslt = list.filter(t => new Date(t.Deadline).getTime() < today.getTime());
    return reuslt;
  }
  GetProcess(list: TaskMessageDisplayModel[]) {
    let reuslt: any[] = [];
    let today = new Date();
    reuslt = list.filter(t => new Date(t.Deadline).getTime() >= today.getTime());
    return reuslt;
  }
  OpenTasks(list: TaskMessageDisplayModel[]) {
    this.selected_tasks = list;
    console.log(this.selected_tasks);
    this.displayTaskDialog = true;
  }
  ViewTaskDetail(item: TaskMessageDisplayModel) {
    if (item.Status == 0) {
      this._task.checkAsRead(item.MessageId).subscribe(res => {
        if (res.Status == 1) {
          if (!item.IsMyTask)
            switch (item.TaskType) {
              case TaskType.UNIFY: {
                this._router.navigate(['/thong-nhat-van-ban/', item.RelatedId]);
                break;
              }
              case TaskType.CONFIRM: {
                this._router.navigate(['/phe-duyet-van-ban/', item.RelatedId]);
                break;
              }
              case TaskType.PERFORM: {
                this._router.navigate(['/thuc-hien-van-ban/', item.RelatedId]);
                break;
              }
            }
          else {
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
            }
          }
        }
      })
    }
    else {
      if (!item.IsMyTask)
        switch (item.TaskType) {
          case TaskType.UNIFY: {
            this._router.navigate(['/thong-nhat-van-ban/', item.RelatedId]);
            break;
          }
          case TaskType.CONFIRM: {
            this._router.navigate(['/phe-duyet-van-ban/', item.RelatedId]);
            break;
          }
          case TaskType.PERFORM: {
            this._router.navigate(['/thuc-hien-van-ban/', item.RelatedId]);
            break;
          }
        }
      else {
        switch (item.TaskType) {
          case TaskType.UNIFY: {
            this._router.navigate(['/ket-qua-thong-nhat/', item.RelatedId]);
          }
          case TaskType.CONFIRM: {
            this._router.navigate(['/ket-qua-phe-duyet/', item.RelatedId]);
            break;
          }
          case TaskType.PERFORM: {
            this._router.navigate(['/ket-qua-thuc-hien/', item.RelatedId]);
            break;
          }
        }
      }
    }


  }
  ViewTaskDetail1(type: number, relateid: number) {
    switch (type) {
      case TaskType.UNIFY: {
        this._router.navigate(['/ket-qua-thong-nhat/', relateid]);
        break;
      }
      case TaskType.CONFIRM: {
        this._router.navigate(['/ket-qua-phe-duyet/', relateid]);
        break;
      }
      case TaskType.PERFORM: {
        this._router.navigate(['/ket-qua-thuc-hien/', relateid]);
        break;
      }
    }
  }
  HideTaskDialog() {
    this.selected_tasks = null;
    this.selectedTask = null;
  }
  OpenDoc(list: DocumentModel[]) {
    this.selected_docs = list;
    this.displayDocDialog = true;
  }
  OpenDetail(item) {
    this.selectedDoc = item;
    this.displayDocDetail = true;
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
  GetMessages() {
    this._task.getAllTaks().subscribe(res => {
      if (res.Status == 1) {
        let sends = res.Data.filter(t => t.ModuleId == Module.SEND && !t.IsMyTask);
        this.send_expired_tasks = this.GetExpires(sends);
        this.send_process_tasks = this.GetProcess(sends);
        let receives = res.Data.filter(t => t.ModuleId == Module.RECEIVE && !t.IsMyTask);
        this.receive_expired_tasks = this.GetExpires(receives);
        this.receive_process_tasks = this.GetProcess(receives);
        let intervals = res.Data.filter(t => t.ModuleId == Module.INTERNAL && !t.IsMyTask);
        this.interval_expired_tasks = this.GetExpires(intervals);
        this.interval_process_tasks = this.GetProcess(intervals);
        this.mytasks = res.Data.filter(t => t.IsMyTask);
      }
    });
  }
  GetTaskName(tasketype: number, status: number) {
    let str = '';
    switch (status) {
      case 0: {
        str += "Đang đợi";
        break;
      }
      case 1: {
        str += "Đang thực hiện";
        break;
      }

    }
    switch (tasketype) {
      case TaskType.UNIFY: {
        str += " thống nhất";
        break;
      }
      case TaskType.CONFIRM: {
        str += " phê duyệt";
        break;
      }
      case TaskType.PERFORM: {
        str += " thực hiện";
        break;
      }
    }
    return str;
  }

  intervalId = window.setInterval(() => this.GetMessages(), 3000);
  update() {

  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DocumentProcessCreateModel, DocumentProcessModel } from '../documentprocess';
import { DocumentProcessService } from '../documentprocess.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import * as $ from 'jquery';
import { TaskType } from '../../home/taskmessage';
@Component({
    templateUrl: './createprocess.component.html',
    styleUrls: ['./createprocess.component.css'],
    providers: [
        DocumentProcessService,
        MessageService
    ],
    encapsulation: ViewEncapsulation.None
})
export class CreateProcessComponent implements OnInit {
    createModel: DocumentProcessCreateModel[] = [];
    directories: any[];
    display: boolean = false;
    newGroupName: string;
    dm_groups: SelectItem[] = [];
    processes: SelectItem[] = [];
    DocumentId: number;
    ModuleType: number;
    constructor(
        private _service: DocumentProcessService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService

    ) {

        this.processes.push({
            label: 'Thống nhất',
            value: 1
        });
        this.processes.push({
            label: 'Phê duyệt',
            value: 2
        });
        this.processes.push({
            label: 'Thực hiện',
            value: 3
        });
        this.processes.push({
            label: 'Đăng ký',
            value: 4
        });
        this.DocumentId = config.data.DocumentId;
        this.ModuleType = config.data.ModuleType;
    }
    ngOnInit() {
        let _this = this;
        $(document).on('click', '.close-card', function () {
            $(this).closest('.process-card').remove();
        })
        $(document).on('click', '.process-card-label', function () {
            _this.OpenSelectProcess($(this).parent('.process-card'));
        })
    }

    OpenSelectProcess(card: any) {

        let _id = parseInt($(card).attr('data-id'));

        if (this.processes.length == _id) {
            $(card).attr('data-id', this.processes[0].value);
            $(card).find('.process-card-label').text(this.processes[0].label);
        }
        else {
            let next = this.processes.filter(c => c.value == (_id + 1))[0];
            $(card).attr('data-id', next.value);
            $(card).find('.process-card-label').text(next.label);
        }

    }
    CheckProcessOrder() {
        let _this = this;
        _this.createModel = [];
        let _area = $('.process-area');
        let _card = $(_area).children('.process-card');
        let total_cards = $(_card).length;
        for (let i = 0; i < total_cards; i++) {
            let tmp = $(_card)[i];
            _this.createModel.push({
                OrderIndex: i + 1,
                TaskType: parseInt($(tmp).attr('data-id')),
                RelatedId: -1
            });
        }
        if(this.createModel.length==0){
            alert('Bạn phải lựu chọn ít nhất một quy trình');
            return false;
        }
        else if(this.createModel.length==1){
            if(this.createModel[0].TaskType!=TaskType.REGISTER){
                alert('Quy trình đơn duy nhất hợp lệ là Đăng ký');
                return false;
            }
        }
        else if(this.createModel.length>1){
            if(this.createModel.filter(d=>d.TaskType==TaskType.REGISTER).length>1) 
            {
                alert('Không thể có nhiều hơn một quy trình đăng ký');
                return false;
            }
            if(this.createModel.filter(d=>d.TaskType==TaskType.CONFIRM).length>1) 
            {
                alert('Không thể có nhiều hơn một quy trình xác nhận');
                return false;
            }
            if(this.createModel.filter(d=>d.TaskType==TaskType.UNIFY).length>1) 
            {
                alert('Không thể có nhiều hơn một quy trình thống nhất');
                return false;
            }
            if(this.createModel.filter(d=>d.TaskType==TaskType.PERFORM).length>1) 
            {
                alert('Không thể có nhiều hơn một quy trình thực hiện');
                return false;
            }
            let current_order=0;
            for(let i=0;i<this.createModel.length;i++){
                let tmp=this.createModel[i];
                let next_order=this.GetValueIndex(tmp.TaskType);
                if(next_order<current_order){
                    alert('Thứ tự không chính xác! Thống nhất > phê duyệt > thực hiện > đăng ký');
                    return false;
               
                }
                else{
                    current_order=next_order;
                }
            }
            
        }
        return true;
    }
    GetValueIndex(type:number){
        switch(type){
            case TaskType.REGISTER:{
                return 3;
            }
            case TaskType.CONFIRM:{
                return 1;
            }
            case TaskType.UNIFY:{
                return 0;
            }
            case TaskType.PERFORM:{
                return 2;
            }
        }
    }
    AddProcess() {
        let _area = $('.process-area');
        let _card = $(_area).children('.process-card');
        let total_cards = $(_card).length;
        let _card_template = `
        <div class="process-card" data-id="1">
        <div class="process-card-label jumbotron">
            Thống nhất
        </div>
        <div class="text-center">
            <label class="close-card"><i class="fas fa-times"></i></label>
        </div>
        </div>
        `;
     
        if (total_cards < 4)
            $(_area).append(_card_template);
        else {
            alert('Too many processes!');
        }
    }
    Save() {
        if (this.CheckProcessOrder()) {
            this._service.Create(this.createModel, this.DocumentId, this.ModuleType).subscribe(res => {
                if (res.Status == 1) {
                    this.ref.close({
                        data: res.Data,
                        process_start: this.createModel[0]
                    });
                }
                else {
                    alert('Tạo tiến trình không thành công');
                }

            });
        }
    }
}
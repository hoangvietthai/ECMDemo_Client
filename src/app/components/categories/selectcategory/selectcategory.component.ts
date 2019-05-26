import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { DocumentCateService } from '../category.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { CreateCategoryComponent } from '../create/createcategory.component';
import { CategoryGroupModel } from '../category';
@Component({
    templateUrl: './selectcategory.component.html',
    providers: [
        DocumentCateService,
        DialogService,
        MessageService
    ]
})
export class SelectCategoryComponent implements OnInit {
    dm_groupcates: SelectItem[];
    cates: SelectItem[];
    selectedCates: any[] = [];
    selections_strings: string[];
    currentGroupCate: CategoryGroupModel;
    constructor(
        private _service: DocumentCateService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dialogService: DialogService,
        private messageService: MessageService
    ) {
        if (this.config.data) {
            this.selectedCates = this.config.data.items;
            this.selections_strings = this.config.data.strings;
        }
    }
    ngOnInit() {
        this._service.getActiveGroup().subscribe(res => {
            if (res.Status == 1) {
                this.currentGroupCate = res.Data;
                this._service.getAllInGroup(this.currentGroupCate.DocumentCateGroupId).subscribe(res => {
                    if (res.Status == 1) {
                        this.cates = [];
                        for (let i = 0; i < res.Data.length; i++)
                            this.cates.push({
                                value: res.Data[i].CategoryId,
                                label: res.Data[i].Name
                            });
                    }
                })
            }
        });
    }
    openCreateCate() {
        const ref = this.dialogService.open(CreateCategoryComponent, {
            header: 'Thêm thể loại tài liệu',
            width: '500px'
        });

        ref.onClose.subscribe((newCate: any) => {
            if (newCate) {

                this.cates = [...this.cates, { value: newCate.CategoryId, label: newCate.Name }];
                this.selectedCates.push({
                    value: newCate.CategoryId,
                    label: newCate.Name
                })

                this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thể loại mới: ' + newCate.Name });
            }
        });
    }
    ChangeSelections(event: any) {
        this.AddSelections();
    }
    AddSelections() {
        // for(let i=0;i<this.selectedCates.length;i++){
        //     if(!this.selections.includes(this.selectedCates[i])){
        //         this.selections.push(this.selectedCates[i]);
        //     }
        // }
        this.getString();

    }
    getString() {
        this.selections_strings = [];
        for (let i = 0; i < this.selectedCates.length; i++) {
            this.selections_strings.push(this.selectedCates[i].label);
        }
    }
    save() {
        if (this.selectedCates.length > 0) {
            this.ref.close({
                items: this.selectedCates,
                strings: this.selections_strings
            });
        }
        else {
            this.ref.close();
        }
    }
    close() {
        this.ref.close();
    }
    OnAdd(event: any) {
        console.log(event);
        this.selections_strings.pop();
    }
    OnRemove(event: any) {
        var item = this.selectedCates.filter(c => c.label === event.value)[0];
        let index = this.selectedCates.indexOf(item);
        this.selectedCates = this.selectedCates.filter((val, j) => j != index);
        this.getString();
    }
}
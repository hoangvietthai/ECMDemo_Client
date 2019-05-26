import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { CategoryModel, CategoryCreateModel } from '../category';
import { DocumentCateService } from '../category.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
@Component({
    templateUrl: './createcategory.component.html',
    providers: [
        DocumentCateService,
        MessageService
    ]
})
export class CreateCategoryComponent implements OnInit {
    createModel: CategoryCreateModel = {};
    directories: any[];
    display: boolean = false;
    newGroupName: string;
    dm_groups: SelectItem[] = [];
    constructor(
        private _service: DocumentCateService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService

    ) {

    }
    ngOnInit() {
        this._service.getAllGroup().subscribe(res => {
            if (res.Status == 1) {

                for (let i = 0; i < res.Data.length; i++) {
                    this.dm_groups.push({
                        value: res.Data[i].DocumentCateGroupId,
                        label: res.Data[i].Name
                    })
                }

            }
        })
    }
    save() {
        this._service.Create(this.createModel).subscribe(res => {
            this.ref.close(res);

        });


    }
    openCreateGroup() {
        this.display = true;
    }
    createNewGroup() {
        console.log(this.newGroupName);
        if ((this.newGroupName.length > 0) && (this.newGroupName)) {
            this._service.CreateGroup({ Name: this.newGroupName }).subscribe(res => {
                if (res.Status == 1) {
                    this.dm_groups.push({
                        value: res.Data.DocumentCateGroupId,
                        label: res.Data.Name
                    });

                    this.createModel.CategoryGroupId = res.Data.DocumentCateGroupId;
                    this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Nhóm thể loại: ' + res.Data.Name });
                    this.display = false;
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
                    this.display = false;
                }
            });


        }


    }
}
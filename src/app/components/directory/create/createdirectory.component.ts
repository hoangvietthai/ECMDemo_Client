import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { DirectoryCreateModel, DirectoryModel, DirectoryUpdateModel } from '../directory';
import { DirectoryService } from '../directory.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
@Component({
    templateUrl: './createdirectory.component.html',
    providers: [
        DirectoryService
    ]
})
export class CreateDirectoryComponent implements OnInit {
    createModel: DirectoryCreateModel = {};
    directories: any[];
    constructor(
        private _service: DirectoryService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {
     
    }
    ngOnInit() {
        this.directories = [];
        this.directories.push({
            value: 0,
            label: 'Thư mục gốc'
        });
        this._service.getAllByModule(this.config.data.ModuleId).subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.directories.push({
                        value: res.Data[i].DirectoryId,
                        label: res.Data[i].Name
                    });

                }
                this.createModel.ParentId = parseInt(this.config.data.ParentId);

            }
        });
    }
    save(){
        this.createModel.ModuleId=this.config.data.ModuleId;
        let user=JSON.parse(localStorage.getItem("ssuser"));
        this.createModel.DepartmentId=user.DepartmentId;
        this._service.Create(this.createModel).subscribe(res=>{
            if(res.Status==1){
                this.ref.close(res.Data);
            }
            else{
                this.ref.close();
            }
        });
        
       
    }
    
}
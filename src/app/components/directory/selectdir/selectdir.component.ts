import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem,SelectItem,TreeNode,MessageService } from 'primeng/api';
import { DirectoryService } from '../directory.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
@Component({
    templateUrl: './selectdir.component.html',
    providers: [
        DirectoryService
    ]
})
export class SelectDirectoryComponent implements OnInit {
    BreadcrumbItems: MenuItem[];
    BreadcrumbHome: MenuItem;
    dirs: TreeNode[];
    selectedDir:any;
    constructor(
        private _dir: DirectoryService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {

    }
    ngOnInit() {
        this.BreadcrumbItems = [
            { label: 'Quản lý danh mục', url: '' },
            { label: 'Danh mục phòng ban' }
        ];
        this.BreadcrumbHome = {
            icon: "pi pi-home"
        }
        this.loadNodes();

    }
    loadNodes() {
        this.dirs = [];
        this._dir.getAllNodes(0).subscribe(res => {
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
    save(){
        console.log(this.selectedDir.node.data);
        if (this.selectedDir) {
            let id:number=parseInt(this.selectedDir.node.data);
            this.ref.close({
                value:id,
                label:this.selectedDir.node.label
            });
        }
        else {
            this.ref.close();
        }
    }
    nodeSelect(event) { 
        this.selectedDir=event;
    }
    
}
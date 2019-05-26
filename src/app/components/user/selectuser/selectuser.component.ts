import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem, MessageService } from 'primeng/api';
import { UserService } from '../user.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { UserDisplayModel } from '../user';
import { ErrorDialogService } from '../../shared/error/dialog/errordialog.service';
import { CreateUserComponent } from '../create/createuser.component';
@Component({
    templateUrl: './selectuser.component.html',
    providers: [
        UserService,
        DialogService,
        MessageService,
        ErrorDialogService
    ]
})
export class SelectUserComponent implements OnInit {
    users: SelectItem[];
    selectedUsers: any[] = [];
    selections_strings: string[];
    constructor(
        private _service: UserService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dialogService: DialogService,
        private messageService: MessageService,
        private errorDialogService: ErrorDialogService
    ) {

    }
    ngOnInit() {
        if (this.config.data) {
            this.selectedUsers = this.config.data.items;


            this.selections_strings = this.config.data.strings;
        }
        let _user = JSON.parse(localStorage.getItem('ssuser'));
        this._service.getAllBase().subscribe(res => {
            if (res.Status == 1) {
                this.users = [];
                for (let i = 0; i < res.Data.length; i++)
                    if (res.Data[i].UserId != _user.UserId) {
                        this.users.push({
                            value: res.Data[i].UserId,
                            label: res.Data[i].UserName
                        });
                    }

            }
        })
    }
    // openCreateCate() {
    //     const ref = this.dialogService.open(CreateCategoryComponent, {
    //         header: 'Thêm thể loại tài liệu',
    //         width: '500px'
    //     });

    //     ref.onClose.subscribe((newCate: any) => {
    //         if (newCate) {

    //             this.cates = [...this.cates, { value: newCate.CategoryId, label: newCate.Name }];
    //             this.selectedCates.push({
    //                 value: newCate.CategoryId,
    //                 label: newCate.Name
    //             })

    //             this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'Thể loại mới: ' + newCate.Name });
    //         }
    //     });
    // }
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
        for (let i = 0; i < this.selectedUsers.length; i++) {
            this.selections_strings.push(this.selectedUsers[i].label);
        }
    }
    save() {
        if (this.selectedUsers.length > 0) {
            this.ref.close({
                items: this.selectedUsers,
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
        var item = this.selectedUsers.filter(c => c.label === event.value)[0];
        let index = this.selectedUsers.indexOf(item);
        this.selectedUsers = this.selectedUsers.filter((val, j) => j != index);
        this.getString();
    }
    openCreateUser(){
        if (JSON.parse(localStorage.getItem("ssuser")).UserRole > 1) {
           alert('Bạn không có quyển thực hiện hành động này');
        }
        else {
            const ref = this.dialogService.open(CreateUserComponent, {
                header: 'Tạo tào khoản',
                width: '500px'
            });

            ref.onClose.subscribe((res: any) => {
                if (res) {
                    if (res.Status == 1) {

                        let users = [...this.users];
                        users.push(res.Data)
                        this.users = users;
                        this.messageService.add({ severity: 'info', summary: 'Tạo thành công', detail: 'User Mới: ' + res.Data.FullName });
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Tạo không thành công', detail: '' });
                    }
                }
            });
        }
    }
}
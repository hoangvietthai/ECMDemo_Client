import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { BusinessPartnerCreateModel, BusinessPartnerModel } from '../businesspartner';
import { BusinessPartnerService } from '../businesspartner.service';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { UserService } from '../../user/user.service';
import { PartnerTypes } from '../../../app.global';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
    templateUrl: './createbusinesspartner.component.html',
    providers: [
        BusinessPartnerService,
        UserService
    ]
})
export class CreatePartnerComponent implements OnInit {
    createModel: BusinessPartnerCreateModel = {};
    users: SelectItem[];
    dm_partnertypes: SelectItem[];
    submitted: boolean;
    formGroup: FormGroup;
    constructor(
        private _service: BusinessPartnerService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private _user: UserService,
        private formBuilder: FormBuilder
    ) {
        this.config.baseZIndex = 1004;
        this.users = [];
        this.dm_partnertypes = PartnerTypes;
    }
    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            Name: ['', Validators.required],
            ResponsibleUserId: ['', Validators.required],
            BusinessTypeId: ['', Validators.required],
            TaxCode: ['', Validators.required],
            AgencyCode: ['', Validators.required],
            BusinessCode: ['', Validators.required],
            BusinessRegisteredCode: ['', Validators.required],
            RegisteredAddress: new FormControl(),
            ActualAddress: new FormControl(),
            Fax: new FormControl(),
            Email: new FormControl(),
            PhoneNumber: new FormControl(),
            Website: new FormControl(),
            Note: new FormControl()
        });
        this.formGroup.patchValue({ BusinessTypeId: this.dm_partnertypes[0].value });
        this._user.getAll().subscribe(res => {
            if (res.Status == 1) {
                for (let i = 0; i < res.Data.length; i++) {
                    this.users.push({
                        value: res.Data[i].UserId,
                        label: res.Data[i].UserName + ' (' + res.Data[i].FullName + ')'
                    });
                }

            }
        });



    }
    get f() { return this.formGroup.controls; }
    onCreate() {
        this.submitted = true;
        if (this.formGroup.invalid) {
            return;
        }
        else {
            this.createModel = {
                Name: this.formGroup.get('Name').value,
                ResponsibleUserId: this.formGroup.get('ResponsibleUserId').value,
                BusinessTypeId: this.formGroup.get('BusinessTypeId').value,
                TaxCode: this.formGroup.get('TaxCode').value,
                AgencyCode: this.formGroup.get('AgencyCode').value,
                BusinessCode: this.formGroup.get('BusinessCode').value,
                BusinessRegisteredCode: this.formGroup.get('BusinessRegisteredCode').value,
                RegisteredAddress: this.formGroup.get('RegisteredAddress').value,
                ActualAddress: this.formGroup.get('ActualAddress').value,
                Fax: this.formGroup.get('Fax').value,
                Email: this.formGroup.get('Email').value,
                PhoneNumber: this.formGroup.get('PhoneNumber').value,
                Website: this.formGroup.get('Website').value,
                Note: this.formGroup.get('Note').value
            }
            this.save();
        }
    }
    save() {
        this._service.Create(this.createModel).subscribe(res => {
            if(res){
                this.ref.close(res);
            }
           

        });


    }

}
export interface DocumentStatusDisplayModel{
    Id?:number;
    DisplayName?:string;
}
export interface DocumentStatusModel{
    Id?:number;
    DisplayName?:string;
    UnifyStatus?:number;
    UnifyRelatedId?:number;
    ConfirmStatus?:number;
    ConfirmRelatedId?:number;
    PerformStatus?:number;
    PerformRelatedId?:number;
    RegisterStatus?:number;
    RegisterRelatedId?:number;
}
export interface DocumentStatusCreateModel{
    UnifyStatus?:number;
    ConfirmStatus?:number;
    PerformStatus?:number;
    RegisterStatus?:number;
    DisplayName?:string;
}
export interface DocumentStatusUpdateModel{
    UnifyStatus?:number;
    UnifyRelatedId?:number;
    ConfirmStatus?:number;
    ConfirmRelatedId?:number;
    PerformStatus?:number;
    PerformRelatedId?:number;
    RegisterStatus?:number;
    RegisterRelatedId?:number;
    DisplayName?:string;
}
export enum StatusType{
    NOTSET=-2,
    INPROCESS=0,
    ACCEPTED=1,
    REJECTED=-1
}
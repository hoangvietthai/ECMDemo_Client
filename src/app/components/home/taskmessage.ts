export interface TaskMessageDisplayModel{
    MessageId?:number;
    Title?:string;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    Deadline?:Date;
    Status?:number;
    TaskType?:number;
    Author?:string;
    RelatedId?:number;
    ModuleId?:number;
    IsMyTask?:number;
}
export interface TaskMessageModel{
    MessageId?:number;
    Title?:string;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    Deadline?:Date;
    Status?:number;
    TaskType?:number;
    UserId?:number;
    RelatedId?:number;
    ModuleId?:number;
    IsMyTask?:number;
}
export interface TaskMessageCreateModel{
    Title?:string;
    CreatedByUserId?:number;
    Deadline?:Date;
    TaskType?:number;
    UserId?:number;
    RelatedId?:number;
    ModuleId?:number;
}
export enum TaskType
{
    UNIFY=1,
    CONFIRM=2,
    PERFORM=3,
    REGISTER=4
  
}
export enum Module
{
    DOCUMENT = 1,
    SEND = 2,
    RECEIVE = 3,
    INTERNAL = 4 
}
//
export interface PendingTaskModel{
    Id?:number;//process
    RelatedId?:number;
    TaskType?:number;
    CreatedOnDate?:Date;
    Status?:number;
}
export interface PendingTaskDetailModel{
    ModuleId?:number;
    TaskType?:number;
    Title?:string;
    DeadLine?:Date;
    CreatedByUser?:string;
}
export interface ExpiredTaskModel{
    ModuleId?:number;
    TaskType?:number;
    Title?:string;
    DeadLine?:Date;
    CreatedByUser?:string;
    RelatedDocumentId?:number;
}
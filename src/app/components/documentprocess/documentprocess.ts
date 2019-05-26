
export interface DocumentProcessModel{
    Id?:number;
    RelatedId?:number;
    TaskType?:number;
    OrderIndex?:number;
    Status?:number;
    CreatedOnDate?:number;
}
export interface DocumentProcessCreateModel{
    RelatedId?:number;
    TaskType?:number;
    OrderIndex?:number;
}
export enum ProcessType{
    NOTSET = -1,
        WAITING = 0,
        INPROCESS = 1,
        FINISHED = 2
}
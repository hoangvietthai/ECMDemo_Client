export interface DocumentPerformModel{
    PerformId?:number;
    Name?:string;
    Description?:string;
    UserList?:string;
    FinishedOnDate?:Date;
    TaskType?:number;
    PriorityLevel?:number;
    CreatedOnDate?:Date;
    CreatedByUserId?:number;
    UpdatedByUserId?:number;
    UpdatedOnDate?:Date;
    Status?:number;
    RelatedDocumentId?:number;
    ModuleId?:number;
    IsFinished?:number;
}
export interface DocumentPerformCreateModel{
    Name?:string;
    Description?:string;
    UserList?:string;
    FinishedOnDate?:Date;
    TaskType?:number;
    PriorityLevel?:number;
    RelatedDocumentId?:number;
    AuthorId?:number;
    ModuleId?:number;
    ProcessId?:number;
}
export interface DocumentPerformUpdateModel{
    Name?:string;
    Description?:string;
    UserList?:string;
    FinishedOnDate?:Date;
    TaskType?:number;
    PriorityLevel?:number;
    RelatedDocumentId?:number;
}
export interface DocumentPerformResponseModel{
    UserId?:number;
    DocumentPerformId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
}
export interface DocumentPerformResponseDisplayModel{
    UserId?:number;
    DocumentPerformId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
    UserName?:string;
    UserFullName?:string;
}
export interface DocumentPerformReCreateModel{
    ModuleId?:number;
    Message?:string;
    UserId?:number;
    ExtraDays?:number;
}
export interface FinishPerformModel{
    UserId?:number;
    Status?:number;
    ProcessId?:number;
}
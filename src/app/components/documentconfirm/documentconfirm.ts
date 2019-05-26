export interface DocumentConfirmModel{
    ConfirmId?:number;
    Name?:string;
    Description?:string;
    UserId?:number;
    FinishedOnDate?:Date;
    PriorityLevel?:number;
    CreatedOnDate?:Date;
    CreatedByUserId?:number;
    UpdatedByUserId?:number;
    UpdatedOnDate?:Date;
    RelatedDocumentId?:number;
    ModuleId?:number;
    IsFinished?:number;
}
export interface DocumentConfirmCreateModel{
    Name?:string;
    Description?:string;
    UserId?:number;
    FinishedOnDate?:Date;
    PriorityLevel?:number;
    CreatedByUserId?:number;
    RelatedDocumentId?:number;
    ModuleId?:number;
    ProcessId?:number;
}
export interface DocumentConfirmUpdateModel{
    Name?:string;
    Description?:string;
    UserId?:number;
    FinishedOnDate?:Date;
    PriorityLevel?:number;
    UpdatedByUserId?:number;
    RelatedDocumentId?:number;
    ModuleId?:number;
}
export interface DocumentConfirmResponseModel{
    UserId?:number;
    DocumentConfirmId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
}
export interface DocumentConfirmResponseDisplayModel{
    UserId?:number;
    DocumentConfirmId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
    UserName?:string;
    UserFullName?:string;
}
export interface DocumentConfirmReCreateModel{
    ModuleId?:number;
    Message?:string;
    UserId?:number;
    ExtraDays?:number;
}
export interface FinishConfirmModel{
    UserId?:number;
    Status?:number;
    ProcessId?:number;
}
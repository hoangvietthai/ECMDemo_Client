export interface DocumentUnifyModel{
    UnifyId?:number;
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
export interface DocumentUnifyCreateModel{
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
export interface DocumentUnifyUpdateModel{
    Name?:string;
    Description?:string;
    UserList?:string;
    FinishedOnDate?:Date;
    TaskType?:number;
    PriorityLevel?:number;
    RelatedDocumentId?:number;
}
export interface DocumentUnifyResponseModel{
    UserId?:number;
    DocumentUnifyId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
}
export interface DocumentUnifyResponseDisplayModel{
    UserId?:number;
    DocumentUnifyId?:number;
    ResponseStatus?:number;
    Note?:string;
    CreatedOnDate?:Date;
    UserName?:string;
    UserFullName?:string;
}
export interface DocumentUnifyReCreateModel{
    ModuleId?:number;
    Message?:string;
    UserId?:number;
    ExtraDays?:number;
}
export interface FinishUnifyModel{
    UserId?:number;
    Status?:number;
    ProcessId?:number;
}
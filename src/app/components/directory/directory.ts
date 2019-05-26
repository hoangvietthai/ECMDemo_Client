export interface DirectoryModel{
    DirectoryId?:number;
    Name?:string;
    ParentId?:number;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    LastModifiedOnDate?:Date;
    LastModifiedByUserId?:number;
}
export interface DirectoryCreateModel{
    Name?:string;
    ParentId?:number;
    CreatedByUserId?:number;
    ModuleId?:number;
    DepartmentId?:number;
}
export interface DirectoryUpdateModel{
    Name?:string;
    ParentId?:number;
}
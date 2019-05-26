export interface DocumentDisplayModel{
    DocumentId?:number;
    Name?:string;
    FileUrl?:string;
    FileCates?:number;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    CreatedByUserName?:number;
    LastModifiedOnDate?:Date;
    Description?:string;
}
export interface DocumentModel{
    DocumentId?:number;
    Name?:string;
    FileUrl?:string;
    FileCates?:string;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    LastModifiedByUserId?:number;
    LastModifiedOnDate?:Date;
    Description?:string;
    DirectoryId?:number;
    DocumentType?:boolean;
}
export interface DocumentCreateModel{
    Name?:string;
    FileUrl?:string;
    FileCates?:string;
    CreatedByUserId?:number;
    DirectoryId?:number;
    Description?:string;
    DocumentType?:boolean;
}

export interface DocumentUpdateModel{
    Name?:string;
    FileCates?:string;
    CreatedByUserId?:number;
    DirectoryId?:number;
    Description?:string;
    DocumentType?:boolean;
}


export interface ReceivedDocumentDisplayModel{
    ReceivedDocumentId?:number;
    Name?:string;
    ResignedNumber?:number;
    ResignedOnDate?:Date;
    ReceiverUserFullName?:string;
    Sender?:string;
    CreatedOnDate?:Date;
    DocumentDate?:Date;
    DocumentIndex?:number;
    DocumentProcessId?:number;
    DocumentStatusId?:number;
}
export interface BaseReceivedDocumentModel{
    ReceivedDocumentId?:number;
    Name?:string;
    Summary?:string;
    CreatedOnDate?:Date;
}
export interface ReceivedDocumentModel{
    ReceivedDocumentId?:number;
    Name?:string;
    Summary?:string;
    CategoryId?:number;
    SenderId?:number;
    DepartmentId?:number;
    SignedByUserId?:number;
    ReceiverId?:number;
    ReceiverUserId?:number;
    DeliveryMethodId?:number;
    SecretLevel?:number;
    DocumentStatusId?:number;
    ResponsibleUserId?:number;
    IsDelete?:boolean;
    ResignedNumber?:number;
    ResignedOnDate?:Date;
    DocumentDate?:Date;
    DocumentIndex?:number;
    CreatedByUserId?:number;
    CreatedOnDate?:Date;
    LastModifiedByUserId?:number;
    LastModifiedOnDate?:Date;
    AttachedFileUrl?:string;
    DocumentProcessId?:number;
}
export interface ReceivedDocumentCreateModel{
    Name?:string;
    Summary?:string;
    CategoryId?:number;
    SenderId?:number;
    DepartmentId?:number;
    SignedByUserId?:number;
    ReceiverId?:number;
    ReceiverUserId?:number;
    DeliveryMethodId?:number;
    SecretLevel?:number;
    DocumentStatusId?:number;
    ResponsibleUserId?:number;
    IsDelete?:boolean;
    ResignedNumber?:number;
    ResignedOnDate?:Date;
    DocumentDate?:Date;
    DocumentIndex?:number;
    CreatedByUserId?:number;
    AttachedFileUrl?:string;
}
export interface ReceivedDocumentUpdateModel{
    Name?:string;
    Summary?:string;
    CategoryId?:number;
    SenderId?:number;
    DepartmentId?:number;
    SignedByUserId?:number;
    ReceiverId?:number;
    ReceiverUserId?:number;
    DeliveryMethodId?:number;
    SecretLevel?:number;
    DocumentStatusId?:number;
    ResponsibleUserId?:number;
    IsDelete?:boolean;
    ResignedNumber?:number;
    ResignedOnDate?:Date;
    DocumentDate?:Date;
    DocumentIndex?:number;
    LastModifiedByUserId?:number;
    AttachedFileUrl?:string;
}
export interface ContactPersonDisplayModel{
    ContactPersonId?:number;
    Name?:string;
    Partner?:string;
    Position?:string;
    OfficePhoneNumber?:string;
    PersonalPhoneNumber?:string;
}
export interface BaseContactPersonModel{
    ContactPersonId?:number;
    Name?:string;
    Position?:string;
}
export interface ContactPersonModel{
    ContactPersonId?:number;
    Name?:string;
    PartnerId?:number;
    Position?:string;
    OfficePhoneNumber?:string;
    PersonalPhoneNumber?:string;
    Email?:string;
    Note?:string;
}
export interface ContactPersonCreateModel{
    Name?:string;
    PartnerId?:number;
    Position?:string;
    OfficePhoneNumber?:string;
    PersonalPhoneNumber?:string;
    Email?:string;
    Note?:string;
}
export interface ContactPersonUpdateModel{
    Name?:string;
    PartnerId?:number;
    Position?:string;
    OfficePhoneNumber?:string;
    PersonalPhoneNumber?:string;
    Email?:string;
    Note?:string;
}
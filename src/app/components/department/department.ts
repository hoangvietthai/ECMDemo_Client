export interface DepartmentModel{
    DepartmentId?:number;
    Name?:string;
    Description?:string;
    LeaderId?:number;
    ParentId?:number;
}
export interface DepartmentDisplayModel{
    DepartmentId?:number;
    Name?:string;
    Description?:string;
    Leader?:string;
    ParentId?:number;
}
export interface DepartmentCreateModel{
    Name?:string;
    Description?:string;
    LeaderId?:number;
    ParentId?:number;
}
export interface DepartmentUpdateModel{
    Name?:string;
    Description?:string;
    LeaderId?:number;
    ParentId?:number;
}
export interface UserModel{
    UserId?:number;
    DepartmentId?:number;
    UserName?:string;
    FullName?:string;
    CreatedOnDate?:Date;
    Password?:string;
    IsDelete?:boolean;
}
export interface UserDisplayModel{
    UserId?:number;
    Department?:string;
    UserName?:string;
    FullName?:string;
    CreatedOnDate?:string;
    UserRoleId?:number;
}
export interface UserDetailModel{
    UserId?:number;
    Department?:string;
    UserName?:string;
    FullName?:string;
    CreatedOnDate?:string;
    PassWord?:string;
}
export interface UserCreateModel{
    UserName?:string;
    Password?:string;
    DepartmentId?:number;
    FullName?:string;
}
export interface UserUpdateModel{
    UserName?:string;
    Password?:string;
    DepartmentId?:number;
    FullName?:string;
}
export interface CategoryGroupModel{
    DocumentCateGroupId?:number;
    Name?:string;
}
export interface CategoryModel{
    CategoryId?:number;
    Name?:string;
    Description?:string;
    CategoryGroupId?:number;
}
export interface CategoryCreateModel{
    Name?:string;
    Description?:string;
    CategoryGroupId?:number;
}
export interface CategoryUpdateModel{
    Name?:string;
    Description?:string;
}
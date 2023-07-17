export interface Category{
    name: string;
    id: string;
    // active:boolean;
    parentCategory?: Category;
}
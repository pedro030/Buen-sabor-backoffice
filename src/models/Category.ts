export interface Category{
    name: string;
    id: string;
    active:boolean;
    subcategories?: Category;
}
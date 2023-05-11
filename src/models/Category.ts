export interface Category{
    name: string;
    id: number;
    active:boolean;
    subcategories?: Category;
}
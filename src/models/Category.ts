export interface Category{
    id: string;
    name: string;
    parentCategory: Category | null;
}
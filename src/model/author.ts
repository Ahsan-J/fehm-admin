import { IBook } from "./book";
import { IGenre } from "./genre";

export interface IAuthor {
    id: string;
    name: string;
    bio: string;
    url: string;
    genre: IGenre[];
    books: IBook[];
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    status: number;
}
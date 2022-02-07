import { IBook } from "./book";
import { IGenre } from "./genre";

export interface IAuthor {
    id: string;
    name: string;
    bio: string;
    url: string;
    genre: IGenre[];
    books: IBook[];
}
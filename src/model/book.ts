import { IAudio } from "./audio";
import { IAuthor } from "./author";
import { IGenre } from "./genre";

export interface IBook {
    id: string;
    title: string;
    author: IAuthor;
    description: string;
    isbn: string;
    purchase_url: string;
    genre: IGenre[];
    audio_list: IAudio[];
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
}
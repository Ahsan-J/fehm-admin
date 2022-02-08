import { FictionGenre, GenreType, NonFictionGenre } from "../constant/genre.enum";

export interface IGenre {
    id: number;
    name: FictionGenre | NonFictionGenre;
    type: GenreType;
}
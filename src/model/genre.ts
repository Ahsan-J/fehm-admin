import { FictionGenre, GenreType, NonFictionGenre } from "../contant/genre.enum";

export interface IGenre {
    id: number;
    name: FictionGenre | NonFictionGenre;
    type: GenreType;
}
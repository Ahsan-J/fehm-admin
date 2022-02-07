import { IBook } from "./book";
import { IReview } from "./review";
import { IUser } from "./user";

export interface IAudio {
    id: string;
    name: string;
    description: string;
    book: IBook;
    url: string;
    narrator: IUser;
    comments: IReview[];
    remark: string;
}
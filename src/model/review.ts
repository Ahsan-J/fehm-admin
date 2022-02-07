import { IAudio } from "./audio";
import { IUser } from "./user";

export interface IReview {
    id: string;
    star: number;
    comment: string;
    parent_id: IReview
    commentor: IUser;
    audio: IAudio;
}
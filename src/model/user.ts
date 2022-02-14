import { MemberShip, UserRole, UserStatus } from "../constant/user.enum";
import { IGenre } from "./genre";

export interface IUser {
    access_token?: string;
    contact_number: string
    created_at: string;
    deleted_at?: string | null
    email: string;
    first_name: string;
    genre?: Array<IGenre>;
    id: string;
    last_name: string;
    membership_status: MemberShip;
    role: UserRole;
    status: UserStatus;
    token_expiry?: number;
    updated_at?: string;
    profile_url?: string;
}
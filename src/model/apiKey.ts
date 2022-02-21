import { IUser } from "./user";

export interface IApiKey {
    key: string;
    name: string;
    app_id: string;
    created_by: IUser;
    expiry_at: string;
    description: string;
    access_level: number;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    status: number;
}
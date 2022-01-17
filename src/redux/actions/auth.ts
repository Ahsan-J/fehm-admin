import { IUser } from "../../model/user"

export const setAuthUser = (user: IUser) => {
    return {
        type: "auth/SET_AUTH_USER",
        user
    }
}
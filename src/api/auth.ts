import { AxiosResponse } from "axios";
import { dispatchAPI, IApiParam } from "../helper/api";
import { setAuthUser } from "../redux/actions/auth";
import { AppThunkDispatch } from "../redux/types";

export const login = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "auth/login"
    params.method = "POST";

    return dispatch(dispatchAPI(params, onSuccessLogin))
}

const onSuccessLogin = (response: AxiosResponse['data'], params: IApiParam) => (dispatch: AppThunkDispatch) => {
    localStorage.setItem("auth_user", JSON.stringify(response.data))
    dispatch(setAuthUser(response.data));
}
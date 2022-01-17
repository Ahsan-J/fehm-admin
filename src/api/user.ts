import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getUsers = (params?:IApiParam) => (dispatch: AppThunkDispatch) => {
    if(!params) params = { path: "user/all"}
    params.method = "GET";

    return dispatch(dispatchAPI(params))
}
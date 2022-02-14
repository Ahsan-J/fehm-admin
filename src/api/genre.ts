import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getGenre = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = `genre`
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getBlobFile = (params:IApiParam) => (dispatch: AppThunkDispatch) => {
    if (!params.path) {
        throw new Error("Path is missing");
    }

    params.responseType = "blob";
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

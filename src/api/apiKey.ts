import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getApiKeys = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "accesspoint"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const updateApiKey = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const deleteApiKey = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

/************************************************************************************************/

export const restoreDeletedApiKey = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}


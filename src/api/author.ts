import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getAuthors = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "author"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const updateAuthor = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const deleteAuthor = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

/************************************************************************************************/

export const restoreDeletedAuthor = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}


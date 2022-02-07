import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getBooks = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "book/all"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params))
}

/************************************************************************************************/

export const getBookDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "GET";
    return dispatch(dispatchAPI(params))
}


/***********************************************************************************************/

export const createBook = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "book/create"
    params.method = "POST";
    return dispatch(dispatchAPI(params))
}
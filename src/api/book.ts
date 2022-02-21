import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getBooks = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "book"
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

/***********************************************************************************************/

export const updateBook = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const deleteBook = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const restoreDeletedBook = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const addBookGenre = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "POST";
    return dispatch(dispatchAPI(params))
}
/***********************************************************************************************/

export const deleteBookGenre = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

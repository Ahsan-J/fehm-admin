import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getUsers = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "user"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params))
}

/************************************************************************************************/

export const getUserDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "GET";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const getUserRoles = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "user/roles"
    params.method = "GET";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const createUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "user/create"
    params.method = "POST";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const updateUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const deleteUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const restoreDeletedUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "PUT";
    return dispatch(dispatchAPI(params))
}

/***********************************************************************************************/

export const addUserGenre = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "POST";
    return dispatch(dispatchAPI(params))
}
/***********************************************************************************************/

export const deleteUserGenre = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = "DELETE";
    return dispatch(dispatchAPI(params))
}

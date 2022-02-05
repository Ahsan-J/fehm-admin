import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { setAuthUser } from '../redux/actions/auth';
import { AppThunkDispatch, RootState } from '../redux/types';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export interface IApiParam{
  path?: AxiosRequestConfig['url'];
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  cancelToken?: AxiosRequestConfig['cancelToken'],
  onUploadProgress?: AxiosRequestConfig['onUploadProgress'],
  onDownloadProgress?:AxiosRequestConfig['onDownloadProgress'],
  headers?: AxiosRequestConfig['headers'],
}

export const apiCall = (params: IApiParam, onSuccess?: Function, onFailure?: Function) => new Promise<AxiosResponse['data']>((resolve, reject) => {
  const requestingObject: AxiosRequestConfig = {
    url: getURL(params),
    headers: params.headers,
    method: params.method ? params.method : 'GET',
    data: params.data || undefined,
    params: params.params ? params.params : undefined,
  };

  if (params.cancelToken)  // injecting the cancel token
    requestingObject.cancelToken = params.cancelToken


  if (params.onUploadProgress)
    requestingObject.onUploadProgress = params.onUploadProgress


  if (params.onDownloadProgress)
    requestingObject.onDownloadProgress = params.onDownloadProgress


  return axios(requestingObject)
    .then((response: AxiosResponse) => {
      // OnSuccess common validations
      if (onSuccess) onSuccess(response.data, params);
      else console.log("onSuccess", requestingObject.url, response.data)
      resolve(response.data);
    })
    .catch((err: AxiosError) => {
      // onFailure common validations
      if (onFailure) onFailure(err, params);
      else console.log("onFailure", requestingObject.url, err, err.response?.data)
      reject(err);
    });
});

export const dispatchAPI = (params: IApiParam, onSuccess?: Function, onFailure?: Function) => (dispatch: AppThunkDispatch) => {
  params.headers = dispatch(getHeaders(params));
  
  return apiCall(params).then((response: AxiosResponse) => {
    if (onSuccess) dispatch(onSuccess(response, params));
    return response;
  }).catch((e: AxiosError) => {
    if (e.response?.status == 401) {
      dispatch(setAuthUser(null))
    }
    if (onFailure) dispatch(onFailure(e, params));
    throw e;
  })
} 

const getURL = (params : IApiParam) => {
  if (params.path)
    return `${API_URL}/${params.path}`;
   else
    throw new Error('Path is undefined');

};

const getHeaders = (params: IApiParam) => (dispatch: AppThunkDispatch, getState: () => RootState) => {

  const a: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    // "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "",
  };

  if (getState().auth.access_token) {
    a['authorization'] = `Bearer ${getState().auth.access_token}`;
  }

  return a;
};

import axios, { AxiosPromise, AxiosInstance } from 'axios'
import { ApiSettings } from './settings'

export class ApiUtils {

  /**
   * Makes a call using axios
   * @param axiosArgs object which contains axios options and service url
   * @return Axios Promise
   **/
  public static makeCall(axiosArgs: any) {
    const axiosRequestArgs = {...axiosArgs.options, url: ApiSettings.SERVER_PATH + axiosArgs.url};
    return axios.request(axiosRequestArgs);
  }
}

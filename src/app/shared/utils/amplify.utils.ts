import { API, Auth, Storage } from "aws-amplify";
import { Constants } from "../models/constants.model";
/* import {
  CognitoUserSession,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js"; */
import { ResponseMessage } from "../models/response.model";
import { LocalStorageHelper } from "./localstorage.utils";
/* import { environment } from "../../../environments/environment"; */

export class AmplifyHelper {
  private static API_NAME = Constants.API_NAME_LOCALHOST;
  static CHALLENGE_NAMES = ["SOFTWARE_TOKEN_MFA", "SMS_MFA"];
  static CHALLENGE_NAME_SETUP = ["MFA_SETUP"];
  static CHALLENGE_PASSWORD_REQUIRED = ["NEW_PASSWORD_REQUIRED"];

  // API METHODS

  static async post<T>(path: string, obj?: any): Promise<ResponseMessage<T>> {
    let access = {
      app_name: Constants.APP_NAME,
      id_user: LocalStorageHelper.getUserId(),
    };
    let _body = {
      body: obj ? { ...obj, ...access } : { ...access },
      // body: obj
    };

    try {
      let { status, message, data, validate, length, name } = await API.post(
        this.API_NAME,
        path,
        _body
      );
      if (status == Constants.STATUS.Success)
        return new ResponseMessage<T>(
          status,
          message,
          <T>data,
          validate,
          length,
          name
        );
      else return new ResponseMessage<T>(status, message, data, validate);
    } catch (error) {
      //console.log(error);
      return new ResponseMessage<T>(
        Constants.STATUS.Error,
        "Ocurrió un error, inténtelo nuevamente.",
        null
      );
    }
  }

  static async get<T>(path: string, params?: Record<string, any>): Promise<ResponseMessage<T>> {
    let access = {
      app_name: Constants.APP_NAME,
      id_user: LocalStorageHelper.getUserId(),
    };

    
    let queryParams = new URLSearchParams({ ...params, ...access }).toString();
    let url = queryParams ? `${path}?${queryParams}` : path;
    
    console.log("this.API_NAME", this.API_NAME)
    console.log("holasss", url)
    try {
      console.log("response_1")
      let response = await API.get(this.API_NAME, url, {});

      console.log("response_2", response)

      let { status, message, data, validate, length, name } = response;

      if (status === Constants.STATUS.Success) {
        return new ResponseMessage<T>(status, message, <T>data, validate, length, name);
      } else {
        return new ResponseMessage<T>(status, message, null, validate);
      }
    } catch (error) {
      console.log("Error", error)
      return new ResponseMessage<T>(
        Constants.STATUS.Error,
        "Ocurrió un error, inténtelo nuevamente.",
        null
      );
    }
  }

  /**
   *
   * @returns getSessionUser() refresh all tokens
   */

  /* static getSessionUser(): Promise<CognitoUserSession> {
    return Auth.currentSession();
  }

  static async getJwtToken(): Promise<string> {
    let currentSessionUser = await this.getSessionUser();
    return currentSessionUser.getIdToken().getJwtToken();
  }

  static async getUrlAPI(): Promise<string> {
    return await API.endpoint(this.API_NAME);
  } */

}

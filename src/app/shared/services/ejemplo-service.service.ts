import { Injectable } from '@angular/core';
import { PATHS } from '@shared_models/paths.model';
import { ResponseMessage } from "@shared_models/response.model";
import { AmplifyHelper } from '@shared_utils/amplify.utils';

@Injectable({
  providedIn: 'root'
})
export class EjemploServiceService {

  constructor() { }

  list(): Promise<ResponseMessage<any>> {
    return AmplifyHelper.post<any>(PATHS.INTRANET.ContabilidadPlanContableListar, null);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class JsonService {

  constructor(private http: HttpClient) { }

     getData(url): Promise<any> {
        return firstValueFrom(this.http.get<any>(url))
    }

}
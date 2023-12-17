import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  // private baseUrl: string = 'http://localhost:3001/api';
  private baseUrl: string = 'https://cacheando-7794c65f4dac.herokuapp.com/api';
  constructor(
    private http: HttpClient
  ) { }

  public get(endpoint: string): Observable <any>{
    return this.http.get(this.baseUrl + endpoint);
  }

  public post(endpoint: string, request: any): Observable <any>{
    return this.http.post(
      this.baseUrl + endpoint,
      request
    );
  }

}

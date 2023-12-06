import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {RestService} from "../rest.service";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private restService: RestService
  ) { }

  public getRoom(id: string): Observable <any>{
    return this.restService.get('/rooms/' + id);
  }

  public createRoom(): Observable <any>{
    return this.restService.post('/rooms', {});
  }

  public setReady(roomId: string, playerId: string): Observable<any> {
    return this.restService.get(
      '/rooms/' + roomId + '/players/' +playerId + '/ready');
  }

}

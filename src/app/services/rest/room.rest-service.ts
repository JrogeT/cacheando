import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {RestService} from "./rest.service";

@Injectable({
  providedIn: 'root'
})
export class RoomRestService {

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

  public getPossibleResults(dicesValue: Array<number>, launchesMade: number, scoreboard: any): Observable<any> {
    console.log(scoreboard);
    return this.restService.post('/results', {dicesValue, launchesMade, scoreboard});
  }

  public sendResult(roomId: string, playerId: string, result: any): Observable<any> {
    return this.restService.post('/rooms/' + roomId + '/players/' + playerId + '/results', {result});
  }

}

import { Component } from '@angular/core';
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.sass'
})
export class BoardComponent {

  constructor(
    private roomRealTimeService: RoomRealtimeService
  ) {
  }

  public get players(): any[] {
    return this.roomRealTimeService.players;
  }

}

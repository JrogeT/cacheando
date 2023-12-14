import { Component } from '@angular/core';
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.sass'
})
export class BoardComponent {

  private playerInTurnId: string;
  constructor(
    private roomRealTimeService: RoomRealtimeService
  ) {
    this.playerInTurnId = localStorage.getItem('playerInTurnId')!;
  }

  public get players(): any[] {
    return this.roomRealTimeService.players;
  }

  public get itsMyTurn(): boolean {
    return this.playerInTurnId === this.roomRealTimeService.getMe().id;
  }

  public get playerInTurnUsername(): string {
    const playerInTurn = this.roomRealTimeService.players.find((player: any) => player.id === this.playerInTurnId);
    return playerInTurn.info.username;
  }

}

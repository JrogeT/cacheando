import { Component } from '@angular/core';
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";
import {RoomRestService} from "../services/rest/room.rest-service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.sass'
})
export class LobbyComponent {

  public username: string;
  public message: string;
  public loading = false;

  public roomId: string | null = '';

  constructor(
    private roomRealTimeService: RoomRealtimeService,
    private roomRestService: RoomRestService
  ) {
    this.username = localStorage.getItem('username')!;
    this.roomId = localStorage.getItem('roomId')!;
    this.message = '';
  }

  public sendMessage(): void {
    if(this.message.length > 30){
      alert('Mensaje muy largo');
      return;
    }

    this.roomRealTimeService.sendMessage(this.message);
    this.message = '';
  }

  public get messages(): string[] {
    return this.roomRealTimeService.messages;
  }

  public get players(): any[] {
    return this.roomRealTimeService.players;
  }

  public get me(): any {
    return this.roomRealTimeService.getMe();
  }

  public toggleReady(): void {
    this.loading = true;
    this.roomRestService.setReady(this.roomId!, this.me.id).subscribe(
      () =>{
        setTimeout(
          ()=> {
            this.loading = false;
          },1000
        );
      }
    )
  }
}

import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PusherService} from "../services/pusher.service";
import {RoomService} from "../services/room/room.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent {

  public roomId: string | null = '';
  public username: string;
  public message: string;
  public loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pusherService: PusherService,
    private roomService: RoomService
  ) {
    this.username = localStorage.getItem('username')!;
    this.message = '';
  }

  public ngOnInit(): void {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.roomService.getRoom(this.roomId).subscribe(
      (response) => {},
      (error) => {
        alert('La partida no existe');
        this.router.navigate(['/login']);
      }
    );
    this.pusherService.subscribe();
    this.pusherService.playerIdBehaviorSubject.subscribe(
      (playerId: string) => {
        // console.log(playerId);
      }
    )
  }

  public sendMessage(): void {
    if(this.message.length > 30){
      alert('Mensaje muy largo');
      return;
    }

    this.pusherService.sendMessage(this.message);
    this.message = '';
  }

  public get messages(): string[] {
    return this.pusherService.messages;
  }

  public get players(): any[] {
    return this.pusherService.players;
  }

  public get me(): any {
    return this.pusherService.getMe();
  }

  public toggleReady(): void {
    this.loading = true;
    this.roomService.setReady(this.roomId!, this.me.id).subscribe(
      (res: any) =>{
        console.log('Setted ready');
        setTimeout(
          ()=> {
            this.loading = false;
          },1000
        );
      }
    )
  }
}

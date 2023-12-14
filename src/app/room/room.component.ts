import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RoomRestService} from "../services/rest/room.rest-service";
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";

@Component({
  selector: 'app-realtime',
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent {

  public roomId: string | null = '';
  public username: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roomRealTimeService: RoomRealtimeService,
    private roomRestService: RoomRestService
  ) {
    this.username = localStorage.getItem('username')!;
  }

  public ngOnInit(): void {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.roomRestService.getRoom(this.roomId).subscribe(
      () => {
        // this.roomRealTimeService.
        // this.roomRealTimeService.playing.subscribe(
        //   (status: boolean) => {
        //     if(status)
        //   }
        // )
      },
      () => {
        alert('La partida no existe');
        this.router.navigate(['/login']);
      }
    );
  }

  public get me(): any {
    return this.roomRealTimeService.getMe();
  }

  public get playing(): boolean {
    return this.roomRealTimeService.playing;
  }
}

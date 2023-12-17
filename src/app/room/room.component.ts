import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RoomRestService} from "../services/rest/room.rest-service";
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roomRealTimeService: RoomRealtimeService,
    private roomRestService: RoomRestService
  ) { }

  public ngOnInit(): void {
    const roomId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.roomRestService.getRoom(roomId).subscribe(
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

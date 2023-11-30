import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {PusherService} from "../pusher.service";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent {

  public roomId: string | null = '';
  public username: string;
  public message: string;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pusherService: PusherService
  ) {
    this.username = localStorage.getItem('username')!;
    this.message = '';
  }

  public ngOnInit(): void {

    this.roomId = this.activatedRoute.snapshot.paramMap.get('id');

    if(!this.roomId){
      this.router.navigate(['/room-not-found']);
      return;
    }

    localStorage.setItem('room', this.roomId);
    this.pusherService.subscribe();

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
    this.pusherService.sendReady();
  }
}

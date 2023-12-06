import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { RoomService } from "../services/room/room.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  public username = '';
  public roomId = '';
  public loading = false;

  constructor(
    private router: Router,
    private roomService: RoomService
  ) {
    localStorage.clear();
  }

  public goToRoom(): void{
    if(!this.isValidUsername())return;
    if(!this.roomId){
      alert('Debes introducir un codigo de partida');
      return;
    }
    if(this.roomId.length > 6){
      alert('Codigo muy largo');
      return;
    }
    this.loading = true;
    this.roomService.getRoom(this.roomId).subscribe(
      (response) => {
        localStorage.setItem('room', this.roomId!);
        this.router.navigate(['/room/'+this.roomId]);
      },
      (error) => {
        alert('La partida no existe');
        this.loading = false;
      }
    )
  }

  public createRoom(): void {
    if(!this.isValidUsername())return;
    this.loading = true;
    this.roomService.createRoom().subscribe(
      (response) => {
        this.roomId = response.id;
        localStorage.setItem('room', this.roomId!);
        localStorage.setItem('channel', response.channelName);
        this.router.navigate(['/room/'+this.roomId]);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    )
  }

  private isValidUsername(): boolean {
    if(!this.username){
      alert('Debes introducir un nombre');
      return false;
    }
    if(this.username.length > 10){
      alert('Nombre muy largo');
      return false;
    }
    localStorage.setItem('username', this.username);
    return true;
  }
}

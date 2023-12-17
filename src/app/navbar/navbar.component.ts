import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {

  public roomId: string;
  public username: string;

  constructor() {
    this.username = localStorage.getItem('username')!;
    this.roomId = localStorage.getItem('roomId')!;
  }

}

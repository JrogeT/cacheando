import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  public username = '';
  public room = '';

  constructor(
    private router: Router
  ) {}

  public login(): void{
    if(!this.username){
      alert('Debes introducir un nombre');
      return;
    }
    if(this.username.length > 10){
      alert('Nombre muy largo');
      return;
    }
    if(!this.room){
      alert('Debes introducir un codigo de partida');
      return;
    }
    if(this.room.length > 5){
      alert('Codigo muy largo');
      return;
    }
    localStorage.setItem('username', this.username);
    this.router.navigate(['/room/'+this.room]);
  }

}

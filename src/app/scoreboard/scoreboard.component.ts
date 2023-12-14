import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.sass'
})
export class ScoreboardComponent {

  @Input('scoreboard') scoreboard: any;
}

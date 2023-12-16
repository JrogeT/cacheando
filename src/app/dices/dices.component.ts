import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrl: './dices.component.sass'
})
export class DicesComponent implements OnInit {

  @Input('dicesValue')dicesValue!: Array<{ selected: boolean, value: number }>;
  @Input('mixing')mixing!: boolean;
  @Output('diceSelected') diceSelected = new EventEmitter<number>();
  public dicesPosition: Array<string> = []

  ngOnInit(): void {
    this.changeDicesPosition();
  }

  private changeDicesPosition(): void {
    this.dicesPosition = Array.from(
      {length: 5},
      () => this.getRandomPosition()
    );
  }

  public getDiceValue(diceIndex: number): string {
    if(this.mixing && !this.dicesValue[diceIndex].selected)
      return '/assets/gifs/mixing.gif';

    return '/assets/images/dice-faces/dice-' + this.dicesValue[diceIndex].value + '.png';
  }

  public selectDice(diceIndex: number): void {
    this.diceSelected.emit(diceIndex);
  }

  public getRandomPosition(): string {
    const positions = ['start','center','end']
    const randomIndex = Math.floor(Math.random() * 2);
    return positions[randomIndex];
  }

}

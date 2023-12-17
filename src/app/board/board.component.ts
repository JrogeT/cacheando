import {Component, OnInit} from '@angular/core';
import {RoomRealtimeService} from "../services/realtime/room.realtime-service";
import {RoomRestService} from "../services/rest/room.rest-service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.sass'
})
export class BoardComponent implements OnInit {

  private roomId: string;
  public results: Array<any> = [];
  public selectedResult: any;

  constructor(
    private roomRealTimeService: RoomRealtimeService,
    private roomRestService: RoomRestService
  ) {
    this.roomId = localStorage.getItem('roomId')!;
  }

  ngOnInit(): void {
    this.roomRealTimeService.generateRandomDicesValue();
    this.roomRealTimeService.actionsMadeBS.subscribe((actionsMade: number) => {
      if(actionsMade == 1) this.getResults();
      if(actionsMade == 2 && !this.hasTurnedDice) this.roomRealTimeService.deselectDices();
      if(actionsMade == 3 && this.hasTurnedDice) this.getResults();
    })
  }

  public get actionsMade(): number {
    return this.roomRealTimeService.actionsMadeBS.value;
  }

  private getResults(): void {
    this.roomRestService.getPossibleResults(
      this.roomRealTimeService.dicesValue.map((dice: any) => dice.value),
      this.roomRealTimeService.actionsMadeBS.value
    ).subscribe(
      (res: any) => {
        this.results = res;
      }
    )
  }

  public get players(): any[] {
    return this.roomRealTimeService.players;
  }

  public get itsMyTurn(): boolean {
    return this.roomRealTimeService.isMyTurn();
  }

  public get playerInTurnUsername(): string {
    const playerInTurn = this.roomRealTimeService.getPlayerInTurn();
    return playerInTurn.info.username;
  }

  public nextTurnAction(): void {
    if (this.actionsMade == 2 && !this.roomRealTimeService.hasSelectedDice()) {
      alert('Debes elegir un dado para voltear');
      return;
    }
    this.roomRealTimeService.nextTurnAction();
  }

  public get dicesValue(): any {
      return this.roomRealTimeService.dicesValue;
  }

  public onDiceSelected(diceIndex: number): void {
    if(this.itsMyTurn)
      this.roomRealTimeService.toggleDiceSelectionStatus(diceIndex);
  }

  public get mixing(): boolean {
    return this.roomRealTimeService.mixing;
  }

  public get hasTurnedDice(): boolean {
    return this.roomRealTimeService.hasTurnedDice;
  }

  public selectResult(result: any): void {
    this.selectedResult = result;
  }
  public finishTurn(): void {
    if (!this.selectedResult) {
      alert('Debes seleccionar algo para anotarte')
      return;
    }
    this.roomRealTimeService.actionsMadeBS.next(4);
    this.roomRestService.sendResult(this.roomId, this.roomRealTimeService.getMe().id, this.selectedResult).subscribe(
      () => {
        this.selectedResult = undefined;
      }
    )
  }

}

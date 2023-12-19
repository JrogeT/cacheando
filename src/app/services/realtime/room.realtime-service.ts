import { Injectable } from '@angular/core';
import {PusherService} from "./pusher.service";
import {BehaviorSubject} from "rxjs";
import {RoomRestService} from "../rest/room.rest-service";

@Injectable({
  providedIn: 'root'
})
export class RoomRealtimeService {

  private channelName = '';
  private roomId = '';
  private playersEventName = '';
  private imReadyEventName = '';
  private startGameEventName = '';
  private endGameEventName = '';
  public players: any[] = [];
  // public playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public playing = false;
  public finished = false;
  public playerInTurnId = '';

  private messagesEventName = '';
  private throwDicesEventName = '';
  private dicesValueEventName = '';
  private diceSelectionChangedEventName = '';
  private deselectDicesEventName = '';
  private turnedDiceEventName = '';
  private turnFinishedEventName = '';
  public messages: string[] = [];

  public dicesValue: Array<{ selected: boolean, value: number }>;
  private mixingDices: boolean;
  private hasTurnedADice: boolean;
  private previousTurnedDice = -1;
  public actionsMadeBS: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private me = {
    id: '',
    ready: false,
    username: ''
  };

  constructor(
    private pusherService: PusherService,
    private roomRestService: RoomRestService
  ) {
    this.channelName = localStorage.getItem('channel')!;
    this.playersEventName = 'client-' + this.channelName + '-players';
    this.imReadyEventName = 'client-' + this.channelName + '-ready';
    this.messagesEventName = 'client-' + this.channelName + '-messages';
    this.startGameEventName = 'client-' + this.channelName + '-start-game';
    this.throwDicesEventName = 'client-' + this.channelName + '-throw-dices';
    this.dicesValueEventName = 'client-' + this.channelName + '-dices-value';
    this.diceSelectionChangedEventName = 'client-' + this.channelName + '-dice-selection';
    this.deselectDicesEventName = 'client-' + this.channelName + '-deselect-dices';
    this.turnedDiceEventName = 'client-' + this.channelName + '-turned-dice';
    this.turnFinishedEventName = 'client-' + this.channelName + '-turn-finished';
    this.endGameEventName = 'client-' + this.channelName + '-end-game';
    this.me.username = localStorage.getItem('username')!;

    this.dicesValue = [];
    this.mixingDices = false;
    this.hasTurnedADice = false;
    this.roomId = localStorage.getItem('roomId')!;

    this.initializeChannel();
  }

  private initializeChannel(): void {
    this.pusherService.setChannel(this.channelName);

    this.pusherService.bind('pusher:subscription_succeeded',this.onSubscriptionSucceeded);
    this.pusherService.bind('pusher:subscription_error', this.onSubscriptionError);
    this.pusherService.bind('pusher:member_added', this.onMemberAdded);
    this.pusherService.bind('pusher:member_removed', this.onMemberRemoved);
    this.pusherService.bind(this.messagesEventName, this.onNewMessage);
    this.pusherService.bind(this.imReadyEventName, this.onImReadyPlayer);
    this.pusherService.bind(this.startGameEventName, this.onStartGame);
    this.pusherService.bind(this.throwDicesEventName, this.onThrownDice);
    this.pusherService.bind(this.dicesValueEventName, this.onDicesValue);
    this.pusherService.bind(this.diceSelectionChangedEventName, this.onDiceSelectionChanged);
    this.pusherService.bind(this.deselectDicesEventName, this.onDeselectDices);
    this.pusherService.bind(this.turnedDiceEventName, this.onTurnedDice);
    this.pusherService.bind(this.turnFinishedEventName, this.onTurnFinished);
    this.pusherService.bind(this.endGameEventName, this.onEndGame);
  }
  private onSubscriptionSucceeded = (): void =>{
    console.log('subscription succeed');
    this.resetPlayers();
    this.me.id = this.pusherService.getChannel().members.me.id;
    this.me.ready = false;

    this.roomRestService.getRoom(this.roomId).subscribe(
      (res: any) => {
        this.playing = res.playing;
        if(this.playing) {
          localStorage.setItem('playerInTurnId', res.playerInTurnId);
          this.playerInTurnId = res.playerInTurnId;
          this.dicesValue = Array.from(
            {length: 5},
            () => {
              return {
                selected: false,
                value: Math.floor(Math.random() * 6) + 1
              };
            }
          );
          this.players = [];
          res.players.forEach((resPlayer: any) => {
            this.players.push({
              id: resPlayer.id,
              info: {
                username: resPlayer.username,
                ready: resPlayer.ready
              },
              scoreboard: resPlayer.scoreboard
            })
          });
        }
      }
    );
  }

  public isMyTurn(): boolean {
    return this.playerInTurnId === this.me.id;
  }

  private onSubscriptionError = (): void =>{
    console.log('subscription error');
  }

  private onMemberAdded = (data: any): void =>{
    this.messages.push(
      data.info.username + ' se ha unido.'
    );
    this.players.push(data);
  }

  private onMemberRemoved = (data: any): void => {
    this.messages.push(
      data.info.username + ' ha salido.'
    );

    const playerRemovedIndex = this.players.findIndex((player: any) => player.id === data.id)
    this.players.splice(playerRemovedIndex, 1);
  }

  private onNewMessage = (data: any): void =>{
    this.messages.push(data.username + ":" + data.message);
  }

  private onImReadyPlayer = (data: any): void =>{
    const playerReadyId = data.playerReadyId;
    let playerReady = this.players.find((player:any)=>player.id===playerReadyId);
    playerReady.info.ready = !playerReady.info.ready;

    if(playerReadyId === this.me.id) this.me.ready = !this.me.ready;
  }

  private onStartGame = (data: any): void => {
    this.players.map((player: any) => player.scoreboard = {});
    localStorage.setItem('playerInTurnId', data.firstPlayer.id);
    this.playerInTurnId = data.firstPlayer.id;
    this.playing = true;
    this.finished = false;

    this.dicesValue = Array.from(
      {length: 5},
      () => {
        return {
          selected: false,
          value: Math.floor(Math.random() * 6) + 1
        };
      }
    );
  }

  private onEndGame = (data: any) => {
    this.finished = true;
    this.playerInTurnId = data.winner.id;
    this.players.find((player: any) => player.id === data.playerInTurn.id).scoreboard = data.playerInTurn.scoreboard;
    this.players.forEach((player: any): void => {
      player.info.ready = false;
    });
  }

  private onThrownDice = (): void => {
    this.mixingDices = true;
  }

  private onDicesValue = (data: any): void => {
    this.mixingDices = false;
    this.dicesValue = data;
  }

  private onDiceSelectionChanged = (data: any): void => {
    let {diceIndex} = data;
    this.dicesValue[diceIndex].selected = !this.dicesValue[diceIndex].selected;
  }

  private onDeselectDices = (): void => {
    this.dicesValue = this.dicesValue.map((dice: any) => {return {...dice, selected: false}});
  }

  private onTurnedDice = (): void => {
    const dice = this.dicesValue.find((dice: any) => dice.selected);
    dice!.value = 7 - dice!.value;
  }

  private onTurnFinished = (data: any): void => {
    this.dicesValue = this.dicesValue.map((dice: any) => {return {...dice, selected: false}});

    const playerInTurn = this.players.find((player: any) => player.id === data.playerInTurn.id);
    if(playerInTurn)
      playerInTurn.scoreboard = data.playerInTurn.scoreboard;

    localStorage.setItem('playerInTurnId', data.nextPlayer.id);
    this.playerInTurnId = data.nextPlayer.id;
    this.hasTurnedADice = false;
    this.actionsMadeBS.next(0);
    this.previousTurnedDice = -1;
    this.mixingDices = false;
  }



  private resetPlayers(): void {
    this.players = [];
    this.pusherService.getChannel().members.each(
      (member: any) => {
        this.players.push(member);
      }
    );
  }

  public sendMessage(message: string){
    this.pusherService.triggerEvent(this.messagesEventName, {
      message: message,
      username: this.me.username,
    });
    this.messages.push(this.me.username + ":" + message);
  }

  public getMe(): any{
    return this.me;
  }

  public generateRandomDicesValue(): void {
    this.dicesValue.forEach((dice: any) => {
      if(!dice.selected)
        dice.value = Math.floor(Math.random() * 6) + 1;
    })
  }

  public nextTurnAction(): void {
    const launchesMade = this.actionsMadeBS.value;
    if(launchesMade <= 1)
      this.throwDices();
    if(launchesMade == 2)
      this.turnDice();
  }

  private turnDice(): void {
    this.hasTurnedADice = true;
    const dice = this.dicesValue.find((dice: any) => dice.selected);
    dice!.value = 7 - dice!.value;
    this.pusherService.triggerEvent(this.turnedDiceEventName, {});
    this.actionsMadeBS.next(this.actionsMadeBS.value + 1);
  }

  private throwDices(): void {
    this.mixingDices = true;
    this.sendThrowDicesEvent();
    setTimeout(
      ()=>{
        this.generateRandomDicesValue();
        this.sendDicesValueEvent(this.dicesValue)
        this.mixingDices = false;
        const launchesMade = this.actionsMadeBS.value;
        this.actionsMadeBS.next(launchesMade + 1);
      },
      3000
    );
  }

  public get mixing(): boolean {
    return this.mixingDices;
  }

  public get hasTurnedDice(): boolean {
    return this.hasTurnedADice;
  }

  public toggleDiceSelectionStatus(diceIndex: number): void {
    if(this.actionsMadeBS.value == 0 || this.hasTurnedADice) return;
    if(this.actionsMadeBS.value == 2 && !this.hasTurnedDice && this.previousTurnedDice >= 0){
      this.dicesValue[this.previousTurnedDice].selected = !this.dicesValue[this.previousTurnedDice].selected;
      this.pusherService.triggerEvent(this.diceSelectionChangedEventName,{diceIndex: this.previousTurnedDice});
    }
    if(this.previousTurnedDice == diceIndex) {
      this.previousTurnedDice = -1;
      return;
    }
    this.dicesValue[diceIndex].selected = !this.dicesValue[diceIndex].selected;
    this.pusherService.triggerEvent(this.diceSelectionChangedEventName,{diceIndex});
    if(this.actionsMadeBS.value == 2)this.previousTurnedDice = diceIndex;
  }

  public sendThrowDicesEvent(): void {
    this.pusherService.triggerEvent(this.throwDicesEventName,{});
  }

  public sendDicesValueEvent(dices: Array<any>): void {
    this.pusherService.triggerEvent(this.dicesValueEventName, dices);
  }

  public deselectDices(): void {
    this.dicesValue = this.dicesValue.map((dice: any) => {return {...dice, selected: false}});
    this.pusherService.triggerEvent(this.deselectDicesEventName, {});
  }

  public hasSelectedDice(): boolean {
    return this.dicesValue.some((dice: any) => dice.selected);
  }

  public getPlayerInTurn(): any {
    return this.players.find((player: any) => player.id === this.playerInTurnId);
  }

  public prepareForGame(): void {
    this.playing = false;
    this.me.ready = false;
  }
}

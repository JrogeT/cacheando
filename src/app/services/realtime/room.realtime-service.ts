import { Injectable } from '@angular/core';
import {PusherService} from "./pusher.service";

@Injectable({
  providedIn: 'root'
})
export class RoomRealtimeService {

  private channelName = '';
  private playersEventName = '';
  private imReadyEventName = '';
  private startGameEventName = '';
  public players: any[] = [];
  // public playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public playing = false;

  private messagesEventName = '';
  public messages: string[] = [];

  private me = {
    id: '',
    ready: false,
    username: ''
  };

  constructor(
    private pusherService: PusherService
  ) {
    this.channelName = localStorage.getItem('channel')!;
    this.playersEventName = 'client-' + this.channelName + '-players';
    this.imReadyEventName = 'client-' + this.channelName + '-ready';
    this.messagesEventName = 'client-' + this.channelName + '-messages';
    this.startGameEventName = 'client-' + this.channelName + '-start-game';
    this.me.username = localStorage.getItem('username')!;

    this.initializeChannel();

    console.log('ctor again from room real time service');
  }

  private initializeChannel(): void {
    this.pusherService.setChannel(this.channelName);

    this.pusherService.bind('pusher:subscription_succeeded',this.onSubscriptionSucceeded);
    this.pusherService.bind('pusher:subscription_error', this.onSubcriptionError);
    this.pusherService.bind('pusher:member_added', this.onMemberAdded);
    this.pusherService.bind('pusher:member_removed', this.onMemberRemoved);
    this.pusherService.bind(this.messagesEventName, this.onNewMessage);
    this.pusherService.bind(this.imReadyEventName, this.onImReadyPlayer);
    this.pusherService.bind(this.startGameEventName, this.onStartGame);
  }
  private onSubscriptionSucceeded = (): void =>{
    console.log('subscribed');
    this.updatePlayers();
    this.me.id = this.pusherService.getChannel().members.me.id;
    // console.log(this.me);
    this.me.ready = false;
    // this.playerIdBehaviorSubject.next(this.me.id);
  }

  private onSubcriptionError = (): void =>{
    console.log('subscription error');
  }

  private onMemberAdded = (data: any): void =>{
    this.messages.push(
      data.info.username + ' se ha unido.'
    );
    this.updatePlayers();
    this.me.ready = false;
  }

  private onMemberRemoved = (data: any): void => {
    this.messages.push(
      data.info.username + ' ha salido.'
    );
    this.updatePlayers();
    console.log(data);
  }

  private onNewMessage = (data: any): void =>{
    this.messages.push(data.username + ":" + data.message);
    console.log(data);
  }

  private onImReadyPlayer = (data: any): void =>{
    const playerReadyId = data.playerReadyId;
    let playerReady = this.players.find((player:any)=>player.id===playerReadyId);
    playerReady.info.ready = !playerReady.info.ready;

    if(playerReadyId === this.me.id) this.me.ready = !this.me.ready;
  }

  private onStartGame = (data: any): void => {
    console.log('starting game: ');
    console.log(data.firstPlayer);
    // this.playing.next(true);
    this.playing = true;
  }

  private updatePlayers(): void {
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

  public sendTest(): void {
    this.pusherService.triggerEvent(
      'testing', {boo: 'foo'}
    );
  }

  public getMe(): any{
    return this.me;
  }
}

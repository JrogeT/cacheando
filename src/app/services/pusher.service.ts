import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private pusher: any;
  private pusherChannel: any;
  private channelName = '';
  private messagesEventName = '';
  private playersEventName = '';
  private imReadyEventName = '';
  private me = {
    id: '',
    ready: false,
    username: ''
  };
  public messages: string[] = [];
  public players: any[] = [];
  public playerIdBehaviorSubject = new BehaviorSubject('');

  constructor() {  }

  public subscribe(): void {

    this.initializePusher();

    this.initializeChannel();

  }

  private initializePusher(): void {
    this.me.username = localStorage.getItem('username')!;
    const roomId: string = localStorage.getItem('room')!;

    Pusher.logToConsole = true;

    this.pusher = new Pusher("672ce2e771fcd7bdc944",
      {
        authEndpoint: "http://localhost:3001/pusher/auth",
        auth: {
          params: {
            username: this.me.username,
            roomId: roomId
          }
        },
        cluster: 'us2',
        encrypted: true,
      });

    this.channelName = localStorage.getItem('channel')!;
    this.messagesEventName = 'client-' + this.channelName + '-messages';
    this.playersEventName = 'client-' + this.channelName + '-players';
    this.imReadyEventName = 'client-' + this.channelName + '-ready';
    console.log('channelName: '+ this.channelName);
    console.log('imreadyeventname: ' + this.imReadyEventName);
  }

  private initializeChannel(): void {
    this.pusherChannel = this.pusher.subscribe(this.channelName);

    this.pusherChannel.bind('pusher:subscription_succeeded', () => {
      console.log('subscribed');
      this.updatePlayers();
      this.me.id = this.pusherChannel.members.me.id;
      // console.log(this.me);
      this.me.ready = false;
      this.playerIdBehaviorSubject.next(this.me.id);
    });
    this.pusherChannel.bind('pusher:subscription_error', () => {
      console.log('subscription error');
    });
    this.pusherChannel.bind('pusher:member_added', (data: any) => {
      this.messages.push(
        data.info.username + ' se ha unido.'
      );
      this.updatePlayers();
      this.me.ready = false;
    });
    this.pusherChannel.bind('pusher:member_removed', (data: any) => {
      this.messages.push(
        data.info.username + ' ha salido.'
      );
      this.updatePlayers();
      console.log(data);
    });
    this.pusherChannel.bind(this.playersEventName, (data: any) => {
      console.log("players",this.players)

      this.players = this.players.map(
        (player: any) =>{
          let dataPlayer = data.players.find((dataPlayer: any)=>dataPlayer.id === player.id);
          console.log("dataplayer", dataPlayer)
          return {
            id: player.id,
            info: {
              username: player.username,
              ...dataPlayer
            }
          }
      });
      console.log("players",this.players)
    });
    this.pusherChannel.bind(this.messagesEventName, (data: any) => {
      this.messages.push(data.username + ":" + data.message);
      console.log(data)
    });
    this.pusherChannel.bind(this.imReadyEventName, (data: any) => {
      const playerReadyId = data.playerReadyId;
      let playerReady = this.players.find((player:any)=>player.id===playerReadyId);
      playerReady.info.ready = !playerReady.info.ready;

      if(playerReadyId === this.me.id) this.me.ready = !this.me.ready;
    });

  }

  public sendMessage(message: string){
    this.triggerEvent(this.messagesEventName, {
      message: message,
      username: this.me.username,
    });
    this.messages.push(this.me.username + ":" + message);
  }

  // public sendReady(): void {
  //   this.me.ready = !this.me.ready;
  //   this.players.find((player:any)=>player.id===this.me.id).info.ready = this.me.ready;
  //   this.triggerEvent(this.imReadyEventName,{
  //     playerReadyId: this.me.id,
  //     readyStatus: this.me.ready
  //   })
  // }

  public getMe(): any{
    return this.me;
  }

  private triggerEvent(eventName: string, params:any){
    this.pusherChannel.trigger(eventName,params);
  }

  private updatePlayers(): void {
    this.players = [];
    this.pusherChannel.members.each(
      (member: any) => {
        this.players.push(member);
      }
    );
  }


}

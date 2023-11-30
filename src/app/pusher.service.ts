import { Injectable } from '@angular/core';
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
  private me: any = {};
  public messages: string[] = [];
  public players: any[] = [];

  constructor() {  }

  public subscribe(): void {

    this.initializePusher();

    this.initializeChannel();

  }

  private initializePusher(): void {
    this.me.username = localStorage.getItem('username')!;

    // Pusher.logToConsole = true;

    this.pusher = new Pusher("672ce2e771fcd7bdc944",
      {
        authEndpoint: "http://localhost:3001/pusher/auth",
        auth: {
          params: {
            username: this.me.username
          }
        },
        cluster: 'us2',
        encrypted: true,
      });

    this.channelName = 'presence-channel-' + localStorage.getItem('room')!;
    this.messagesEventName = 'client-' + this.channelName + '-messages';
    this.playersEventName = 'client-' + this.channelName + '-players';
    this.imReadyEventName = 'client-' + this.channelName + '-ready';
  }

  private initializeChannel(): void {
    this.pusherChannel = this.pusher.subscribe(this.channelName);


    this.pusherChannel.bind('pusher:subscription_succeeded', () => {
      console.log('subscribed');
      this.updatePlayers();
      this.me.userId = this.pusherChannel.members.me.id;
      this.me.ready = false;
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
      playerReady.info.ready = data.readyStatus;
    });

  }

  public sendMessage(message: string){
    this.triggerEvent(this.messagesEventName, {
      message: message,
      username: this.me.username,
    });
    this.messages.push(this.me.username + ":" + message);
  }

  public sendReady(): void {
    this.me.ready = !this.me.ready;
    this.players.find((player:any)=>player.id===this.me.userId).info.ready = this.me.ready;
    this.triggerEvent(this.imReadyEventName,{
      playerReadyId: this.me.userId,
      readyStatus: this.me.ready
    })
  }

  public getMe(): any{
    return {
      username: this.me.username,
      ready: this.me.ready
    }
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

import { Injectable } from '@angular/core';
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private pusher: any;
  private pusherChannel: any;
// public playerIdBehaviorSubject = new BehaviorSubject('');

  constructor() {
    this.initializePusher();
  }

  public setChannel(channelName: string): void {
    this.pusherChannel = this.pusher.subscribe(channelName);
  }

  public getChannel(): any {
    return this.pusherChannel;
  }

  public bind(eventName: string, callback: any): void {
    this.pusherChannel.bind(eventName, callback);
  }

  private initializePusher(): void {
    const roomId: string = localStorage.getItem('roomId')!;
    const username = localStorage.getItem('username')!;

    Pusher.logToConsole = true;

    this.pusher = new Pusher("672ce2e771fcd7bdc944",
      {
        authEndpoint: "http://localhost:3001/pusher/auth",
        auth: {
          params: {
            username: username,
            roomId: roomId
          }
        },
        cluster: 'us2',
        encrypted: true,
      });
    console.log('pusherService.ctor finished');
  }

  public triggerEvent(eventName: string, params:any){
    this.pusherChannel.trigger(eventName, params);
  }




}

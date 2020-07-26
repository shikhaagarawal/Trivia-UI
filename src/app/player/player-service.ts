import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Player } from '../model/player';
import { PlayerComponent } from './player.component';

export class PlayerService {

    webSocketEndPoint: string = 'https://trivia-sa.herokuapp.com/ws';
    topic: string = "/topic/play/game";
    stompClient: any;

    constructor() {}

    _connect(){
      console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;

         _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                  console.log("response from topic recieved");
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    }

    newPlayer(playerName: string) {
        console.log("I am here");
        let player= new Player();
        player.playerName = playerName;
        this.stompClient.send("/app/add/player", {}, JSON.stringify(player));
    };

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
        console.log(JSON.stringify(message.body));
        //this.playerComponent.handleMessage(JSON.stringify(message.body));
    }

}

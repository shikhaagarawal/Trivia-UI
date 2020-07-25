import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Player } from '../model/player';
import { PlayerComponent } from './player.component';

export class PlayerService {

    webSocketEndPoint: string = 'http://localhost:8080';
    topic: string = "/topic/add/player";
    stompClient: any;
    //playerComponent: PlayerComponent

    constructor() {
      //this.playerComponent= playerComponent;
    }

    newPlayer(playerName: String) {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;

         _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
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
        //this.playerComponent.handleMessage(JSON.stringify(message.body));
    }

}

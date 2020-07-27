import{Component, OnInit, OnDestroy}from '@angular/core';
import {FormBuilder, FormGroup, FormControl }from "@angular/forms";
//import { PlayerService } from './player-service';
import {Player }from '../model/player';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
selector: 'app-player',
templateUrl: './player.component.html',
styleUrls: ['./player.component.css']
//providers : [PlayerService]
})
export class PlayerComponent implements OnInit,OnDestroy {

player : Player;
form: FormGroup;
webSocketEndPoint: string = 'http://localhost:8080/ws';
topic: string = "/topic/play/game";
stompClient: any;

constructor(public fb: FormBuilder) {
    this.form = this.fb.group({
      inputName: ['']
    })
  }

  ngOnInit(): void {
    this.player = new Player();
    this._connect();
  }

  submitForm() {
    this.newPlayer(this.form.get('inputName').value);
  }

    ngOnDestroy() {
    }

    _connect(){
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
    }

    newPlayer(playerName: string) {
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
        this.player = JSON.parse(message.body);
    }

}

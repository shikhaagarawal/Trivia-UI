import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {Player} from '../model/player';
import {Question} from '../model/question';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {QuizStats} from "../model/quizStats";
import {Chart} from 'chart.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  player: Player;
  question: Question;
  form: FormGroup;
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/play/game";
  stompClient: any;
  answerSelected: boolean;
  newPlayerAdded: boolean;

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
    this.newPlayerAdded = true;
    this.newPlayer(this.form.get('inputName').value);
  }

  ngOnDestroy() {
  }

  _connect() {
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
    let player = new Player();
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
    let tempObject = JSON.parse(message.body);
    if (tempObject.playerName) {
      this.player = tempObject;
    } else if (tempObject.question) {
      this.answerSelected = false;
      this.question = tempObject;
    } else if (tempObject.stats) {
      //load stats
      this.stats = tempObject;
      this.renderChart();
    }
  }

  onAnswerSelect(event) {
    this.player.selectedAnswer = event.value;
    this.answerSelected = true;
    //Send selectedAnswer to server
    this.stompClient.send("/app/quiz/choice", {}, JSON.stringify(this.player));
  }

  //Show Statistics after every quiz
  stats: QuizStats[];
  Options = [];
  Selected = [];
  Chart = [];

  renderChart() {
    this.Chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.Options,
        datasets: [
          {
            data: this.Selected,
            borderColor: '#3cb371',
            backgroundColor: "#0000FF",
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}

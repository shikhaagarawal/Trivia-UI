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
  playerQueue: string = "/user/queue/play/game";
  addPlayerAPI: string = "/app/add/player";
  quizAnswerSelectionAPI: string = "/app/quiz/selection";
  stompClient: any;
  answerSelected: boolean;
  newPlayerAdded: boolean;
  timeLeft: number = 10;
  interval;

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
      _this.stompClient.subscribe(_this.playerQueue, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  newPlayer(playerName: string) {
    this.player.playerName = playerName;
    this.stompClient.send(this.addPlayerAPI, {}, JSON.stringify(this.player));
  }

  onAnswerSelect(event) {
    this.player.selectedAnswer = event.value;
    this.answerSelected = true;
    this.stompClient.send(this.quizAnswerSelectionAPI, {}, JSON.stringify(this.player));
  }

  onMessageReceived(message) {
    let tempObject = JSON.parse(message.body);
    if (tempObject.playerName) {
      this.player = tempObject;
      if (this.player.startGame) {
        this.startCountDown(10);
      }
    } else if (tempObject.question) {
      this.answerSelected = false;
      this.question = tempObject;
    } else {
      //load stats
      this.stats = tempObject;
      this.renderChart();
    }
  }

  private startCountDown(timeInSeconds) {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      if (this.timeLeft == 0) {
        clearInterval(this.interval);
      }
    }, 1000)
  }

  //Show Statistics after every quiz
  stats: QuizStats[];
  Options = [];
  Selected = [];
  Chart = [];

  renderChart() {
    this.stats.forEach((quizStats, index) => {
        this.Options.push(quizStats.choice);
        this.Selected.push(quizStats.playerCount);
    });
    this.Chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.Options,
        datasets: [
          {
            data: this.Selected,
            borderColor: '#edb139',
            backgroundColor: "#edb139",
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
            display: true,
            ticks: {
              stepSize: 1,
              beginAtZero: true,
            }
          }],
        }
      }
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      //TODO disconnect at server
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
  }
}

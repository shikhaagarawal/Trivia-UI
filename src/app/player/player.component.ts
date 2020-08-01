import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Player} from '../model/player';
import {Question} from '../model/question';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {QuizStats} from "../model/quizStats";
import {Chart} from 'chart.js';
import {Router} from "@angular/router";


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  WEB_SOCKET_ENDPOINT: string = 'https://trivia-sa.herokuapp.com/ws';
  //WEB_SOCKET_ENDPOINT: string = 'http://localhost:8080/ws';
  PLAYER_QUEUE: string = "/user/queue/play/game";
  ADD_PLAYER_API: string = "/app/add/player";
  QUIZ_SELECTED_ANSWER_API: string = "/app/quiz/selection";

  player: Player;
  question: Question;
  form: FormGroup;
  stompClient: any;
  answerSelected: boolean;
  newPlayerAdded: boolean;
  timeLeft: number = 10;
  interval;
  startTime;
  timeTakenToAnswer;
  progressBar : boolean;

  //For stats canvas rendering
  stats: QuizStats[];
  Options = [];
  Selected = [];
  Chart = [];

  constructor(public fb: FormBuilder,private router: Router) {
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
    let ws = new SockJS(this.WEB_SOCKET_ENDPOINT);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.PLAYER_QUEUE, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
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

  /**
   * Add player in server by calling ADD_PLAYER_API
   * @param playerName
   */
  newPlayer(playerName: string) {
    this.player.playerName = playerName;
    this.stompClient.send(this.ADD_PLAYER_API, {}, JSON.stringify(this.player));
  }

  /**
   * Ensure that player can select only one answer, therefore disable all other choices.
   * Also, send the answer to the server
   * @param event
   */
  onAnswerSelect(event) {
    this.player.selectedAnswer = event.value;
    this.answerSelected = true;
    this.timeTakenToAnswer = (performance.now()-this.startTime).toFixed(2);;
    this.stompClient.send(this.QUIZ_SELECTED_ANSWER_API, {}, JSON.stringify(this.player));
  }

  /**
   * Websocket broadcast message will be recived here.
   * @param message
   */
  onMessageReceived(message) {
    this.stats=[];
    this.progressBar = false;
    this.question=null;
    let responseJson = JSON.parse(message.body);
    if (responseJson.stats && responseJson.stats.length > 0) {
      this.question=null;
      this.showStatistics(responseJson);
    } else if (responseJson.playerName) {
      this.decidePlayerDisplay(responseJson);
    } else if (responseJson.question) {
      this.displayQuestion(responseJson);
    } else if(responseJson.winner){
      this.showCongrats();
    }
  }

  /**
   * Decide whether player will begin the new game or exit current one based on websocket message response
   * @param responseJson
   * @private
   */
  private decidePlayerDisplay(responseJson) {
    this.player = responseJson;
    this.timeLeft=10;
    this.startCountDown(10);
    if (!responseJson.playing) {
      this.showThankYou();
    }
  }

  /**
   * Reset the parameters to show a fresh question of next level
   * @param responseJson
   * @private
   */
  private displayQuestion(responseJson) {
    this.Chart = [];
    this.timeLeft = 15;
    this.answerSelected = false;
    this.question = responseJson;
    this.startTime = performance.now();
    this.timeTakenToAnswer = '';
    this.startCountDown(15);
  }

  /**
   * Display stats and if player can not continue next level then end his game.
   * @param responseJson
   * @private
   */
  private showStatistics(responseJson) {
    this.progressBar = true;
    this.stats = responseJson.stats;
    this.question = null;
    this.timeLeft=10;
    this.startCountDown(10);
    this.renderChart();

    if (!responseJson.playing) {
      this.showThankYou();
    }
    this.stats=[];
  }

  private showThankYou() {
    this.player = null;
    //Wait for 3 seconds before showing thank you page.
    setTimeout(() => {
        this.router.navigate(['thankYou'])
      }
      , 3000);
    this.disconnect();
  }

  private showCongrats(){
    setTimeout(() => {
        this.router.navigate(['winner'])
      }
      , 3000);
    this.disconnect();
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


  renderChart() {
    this.Options = [];
    this.Selected = [];
    this.Chart = [];
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


}

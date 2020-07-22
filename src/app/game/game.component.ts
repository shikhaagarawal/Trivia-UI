import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import {Games} from './games';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})



export class GameComponent implements OnInit {

  games:Games;
  constructor(private httpClientService:HttpClientService) { }

  ngOnInit() {
    this.httpClientService.getGames().subscribe(
     response =>this.handleSuccessfulResponse(response),
    );
  }

  handleSuccessfulResponse(response)
  {
    //this.games=response;
    console.log("here:"+response.question);
    this.games = response;
  }

}

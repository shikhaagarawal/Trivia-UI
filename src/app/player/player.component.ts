import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { PlayerService } from './player-service';
import { Player } from '../model/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers : [PlayerService]
})
export class PlayerComponent implements OnInit,OnDestroy {

  player : Player;
  form: FormGroup;
  userName: String;

 constructor(public fb: FormBuilder,private playerService: PlayerService) {
    this.form = this.fb.group({
      inputName: ['']
    })
  }

    //constructor(playerService: PlayerService) {}

  ngOnInit(): void {
    //this.playerService = new PlayerService(new PlayerComponent());
  }

  submitForm() {
    //var formData: any = new FormData();
    //formData.append("userName", this.form.get('inputName').value);

    //var player = {};
    //formData.forEach((value, key) => {player[key] = value});
    //var json = JSON.stringify(player);

    //console.log(json);

    //this.httpClientService.newPlayer(json).subscribe(
      //(response) => console.log(response),
      //(error) => console.log(error)
    //)

    this.playerService.newPlayer(this.form.get('inputName').value)
  }

    ngOnDestroy() {
    }

  handleMessage(message){
    this.player = message;
  }

}

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

  ngOnInit(): void {
    this.playerService._connect();
  }

  submitForm() {
    this.playerService.newPlayer(this.form.get('inputName').value);
  }

    ngOnDestroy() {
    }

  handleMessage(message){
    this.player = message;
  }

}

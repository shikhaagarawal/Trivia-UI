import { Component } from '@angular/core';
import { HttpClientService } from './service/http-client.service';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'trivia-ui';
  form: FormGroup;
  userName: String;

  constructor(public fb: FormBuilder, private httpClientService:HttpClientService) {
    this.form = this.fb.group({
      inputName: ['']
    })
  }

  submitForm() {

    var formData: any = new FormData();
    formData.append("userName", this.form.get('inputName').value);

    var player = {};
    formData.forEach((value, key) => {player[key] = value});
    var json = JSON.stringify(player);

    console.log(json);

    this.httpClientService.newPlayer(json).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )

  }
}

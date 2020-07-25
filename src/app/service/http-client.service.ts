import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Games{
constructor(
    public question:string,
    public choice:string[],
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

private REST_API_SERVER = "http://localhost:8080";
  constructor(private httpClient:HttpClient) { }

  getGames(){
    return this.httpClient.get<Games[]>('https://trivia-sa.herokuapp.com/api/games');
    //return this.httpClient.get<Games[]>('/games');
  }

  newPlayer(player){
    return this.httpClient.post<any>(this.REST_API_SERVER+'/api/newPlayer',player);
  }
}

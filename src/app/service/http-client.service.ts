import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { over } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs/internal/Observable';

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
    //return this.httpClient.post<any>(this.REST_API_SERVER+'/api/newPlayer',player);
    const conn = over(new SockJS('http://localhost:8080/live'));
    return new Observable(observer => observer.next(conn));
  }
}

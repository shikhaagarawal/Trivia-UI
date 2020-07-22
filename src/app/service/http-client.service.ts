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

  constructor(private httpClient:HttpClient) { }

  getGames(){
    console.log("test call");
    //return this.httpClient.get<Games[]>('http://localhost:8080/games');
    return this.httpClient.get<Games[]>('/games');
  }
}

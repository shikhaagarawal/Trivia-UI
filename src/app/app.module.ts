import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayerComponent } from './player/player.component';
import { PlayerService } from './player/player-service';
import { FormsModule } from '@angular/forms';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { LandingComponent } from './landing/landing.component';
import { WinnerComponent } from './winner/winner.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    ThankyouComponent,
    LandingComponent,
    WinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule

  ],
  providers: [
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

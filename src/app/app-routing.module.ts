import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ThankyouComponent} from "./thankyou/thankyou.component";
import {LandingComponent} from "./landing/landing.component";
import {WinnerComponent} from "./winner/winner.component";

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'thankYou', component: ThankyouComponent},
  {path: 'winner', component: WinnerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

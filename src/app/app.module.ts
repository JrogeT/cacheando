import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RoomComponent} from "./room/room.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app.routing-module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {LobbyComponent} from "./lobby/lobby.component";
import {BoardComponent} from "./board/board.component";
import {ScoreboardComponent} from "./scoreboard/scoreboard.component";
import {DicesComponent} from "./dices/dices.component";
import {NavbarComponent} from "./navbar/navbar.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RoomComponent,
        LobbyComponent,
        BoardComponent,
        ScoreboardComponent,
        DicesComponent,
        NavbarComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

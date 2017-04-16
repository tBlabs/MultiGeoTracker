import { NavigatorService } from './services/navigator.service';
import { TeamService } from './services/team.service';
import { MapComponent } from './components/map.component';
import { UserPanelComponent } from './components/user-panel.component';
import { AppComponent } from './components/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { CommonModule } from "@angular/common";


var firebaseConfig =
  {
    apiKey: "AIzaSyC7BWOUfEaKxVvBGSJ-zWILP_mM1EbIPqI",
    authDomain: "multi-tracker-1490724017959.firebaseapp.com",
    databaseURL: "https://multi-tracker-1490724017959.firebaseio.com",
    storageBucket: "multi-tracker-1490724017959.appspot.com",
    messagingSenderId: "342416244030"
  };

@NgModule({
  declarations: [
    AppComponent,
    UserPanelComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB8UcN2A2wrWfea6zZUQhRrDkDT92ugBMc'
    })
  ],
  providers: [
    TeamService,
    NavigatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

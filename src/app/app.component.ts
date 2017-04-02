import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

 import 'rxjs';
import 'rxjs/add/operator/debounceTime';

// class User
// {
//   name: string;
//   team: string;
// }
// class DbItem
// {
//   user: User;
//   geoLocation: Geolocation;
// }

class DbItem
{
  public name: string;
  public val: number;
}

@Component({
  selector: 'app-root',
  template: `
  <user-panel></user-panel>
 
    `, 
    /*
          <team (change)=""></team>

    */
  //  Team: <input type="text" #team (keydown)="SelectTeam(team.value)">
  //    My name: <input type="text" #me (keydown)="ChangeMyName(me.value)">
  //    Teammates: {{ teammates }}

  //     <li *ngFor="let item of items">
  //      {{ item | json }}
  //   </li>
    
  //   <div (mousemove)="Move($event)" style="width: 700px; height: 300px; background: #aaa">{{mouse}}</div>
   
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  title = '(items count)';
  teammates: number = 0;
  selectedTeam = new Subject<string>();
  mouse: any;
  items: any;// FirebaseListObservable<any>;
  move = new Subject<any>();
  myName = new Subject<string>();
  meInDb: string;
  myTeam: string;
  lastTeam: string = "";

ChangeMyName(name: string)
{
  this.myName.next(name);
}

constructor(//private _af: AngularFire
)
{
  // let jsonDbItem = '{ "ndame": "tom", "val": "ASDF" }';
  // let dbItem: DbItem = JSON.parse(jsonDbItem);

  // console.log(dbItem.name);
  // console.log(dbItem.val);
  

  // this.myName.throttleTime(200).subscribe((myName: string) =>
  // {
  //   _af.database.object("").update({ name: myName });
  // });

  //   if (this.lastTeam!="") 
  //   {
  //     console.log("Removing "+this.lastTeam+"...");
      
  //     this._af.database.list('/items').remove(this.lastTeam);
  //   }

  //   var pushed = this._af.database.list('/items').push({ team: team });    
  //   this.lastTeam = pushed.key;
  //   console.log("Adding "+pushed.key+"...");
}

 
  SelectTeam(team: string): void
  {
  //   if (this.lastTeam!="") 
  //   {
  //     console.log("Removing "+this.lastTeam+"...");
      
  //     this._af.database.list('/items').remove(this.lastTeam);
  //   }

  //   var pushed = this._af.database.list('/items').push({ team: team });    
  //   this.lastTeam = pushed.key;
  //   console.log("Adding "+pushed.key+"...");
  //   pushed.then((x) =>
  //   {
  //     console.log(x.length);
      
  //   })
    
  }
}

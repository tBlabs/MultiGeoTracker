import { TeamService } from './team.service';
import { TestBed } from '@angular/core/testing';
import { Component, Output, EventEmitter } from '@angular/core';
//import { FirebaseRef, AngularFire, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from "rxjs";

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
    public team: string;
    public name: string;
}

enum FormState
{
    Initial, Joining, Joined, Detaching, NameTaken
}

@Component({
    selector: 'user-panel',
    template: `<input type="text" #team value="TEAM-A" [disabled]="teamInputDisable" placeholder="Team">
            <input type="text" #me value="Me" [disabled]="userInputDisable" [class.busy]="userInputError" placeholder="Your name">
         
             <button *ngIf="joinButtonVisable" (click)="TryJoin(team.value, me.value)">{{ joinButtonText }}</button>
             <button *ngIf="!joinButtonVisable" (click)="Detach()">{{ detachButtonText }}</button>

             <button (click)="_team.Test()">Update</button>
    `,
    styles: ['.busy { border-color:  red }']
})
export class UserPanelComponent
{
    @Output() teamChange = new EventEmitter<string>();

    private team: string = "";
    
    teamInputDisable = false;
    userInputDisable = false;
    userInputError = false;
    joinButtonVisable = true;
    private joinButtonText: string = "Join";
    private detachButtonText: string = "Detach";

    constructor(private _team: TeamService)
    {
        this.SetFormState(FormState.Initial);
    }
     
    private SetFormState(state: FormState): void
    {
        this.teamInputDisable = false;
        this.userInputDisable = false;
        this.userInputError = false;
        this.joinButtonVisable = true;
        this.joinButtonText = "Join";
        this.detachButtonText = "Detach";

        switch (state)
        {
            case FormState.Initial:
                // do nothing
                break;
            case FormState.Joining:
                this.teamInputDisable = true;
                this.userInputDisable = true;
                this.joinButtonText = "Joining...";
                break;
            case FormState.Joined:
                this.teamInputDisable = true;
                this.userInputDisable = true;
                this.joinButtonVisable = false;
                break;
            case FormState.Detaching:
                this.teamInputDisable = true;
                this.userInputDisable = true;
                this.joinButtonVisable = false;
                this.detachButtonText = "Detaching...";
                break;
            case FormState.NameTaken:
                this.userInputError = true;
                break;
        }
    }

    TryJoin(team, me)
    {
        this.SetFormState(FormState.Joining);

        this._team.TryJoinTeam(team, me).subscribe(x =>
        {
            console.log(x);
            this.SetFormState(FormState.Joined);
        },
            (err) =>
            {
                console.log(err);
                this.SetFormState(FormState.NameTaken);
            });
    }

    Detach()
    {
        this.SetFormState(FormState.Detaching);

        this._team.Detach().subscribe(() =>
        {
            this.SetFormState(FormState.Initial);
        });
    }


}

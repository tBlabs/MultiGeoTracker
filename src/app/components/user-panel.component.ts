import { TeamService } from './../services/team.service';
import { TestBed } from '@angular/core/testing';
import { Component, Output, EventEmitter } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";


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
    template: `
   
       <input type="text" #team 
              value="Team" 
              [disabled]="teamInputDisable" 
              placeholder="Team name">

       <input type="text" #me 
              value="Me" 
              [disabled]="userInputDisable" 
              [class.err]="userInputError" 
              placeholder="Your initials" 
              maxlength="2">
         
       <button *ngIf="joinButtonVisable" 
               (click)="TryJoin(team.value, me.value)">
               {{ joinButtonText }}
       </button>
       <button *ngIf="!joinButtonVisable" 
               (click)="Detach()">
               {{ detachButtonText }}
       </button>

    `,
    styles: 
    [`
        .err { border: 1px solid red }    
        input { width: 80px }
    `]
})
export class UserPanelComponent
{
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
            default:
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

    TryJoin(team: string, me: string): void
    {
        this.SetFormState(FormState.Joining);

        this._team.TryJoinTeam(team, me).subscribe(() =>
        {
            console.log("Joining successed.");

            this.SetFormState(FormState.Joined);
        },
            (err) =>
            {
                console.log("Joining error: " + err);

                this.SetFormState(FormState.NameTaken);
            });
    }

    Detach(): void
    {
        this.SetFormState(FormState.Detaching);

        this._team.Detach().subscribe(() =>
        {
            this.SetFormState(FormState.Initial);
        });
    }
}

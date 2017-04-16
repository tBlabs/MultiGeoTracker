import { Teammate } from './../models/teammate.model';
import { NavigatorService } from './navigator.service';
import { Subject } from 'rxjs/Subject';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subscription } from "rxjs/Subscription";


@Injectable()
export class TeamService 
{
    private team: string;
    private user: string;
    private myKeyInDb: any = null;

    private currentTeam: Subscription;
    public teammates = new Subject<Teammate[]>();


    constructor(private _db: AngularFire, private _gps: NavigatorService)
    {
        _gps.position.subscribe((position: Coordinates) =>
        {
            this.UpdateLocationInDb(position);
        });
    }

    private UpdateLocationInDb(position: Coordinates)
    {
        console.log("Storing user '"+this.user+"' position (" + position.latitude + "/" + position.longitude + ") in db...");

        if (this.myKeyInDb != null)
        {
            this._db.database.list("/teams/" + this.team).update(this.myKeyInDb, { latitude: position.latitude, longitude: position.longitude }).then(() =>
            {
                console.log("User position in db updated.");
            });
        }
        else console.log("User not joined to any team");
    }

    private IsLoggedIn()
    {
        return this.myKeyInDb != null;
    }

    private GetTeammates(team): Observable<any>
    {
        return this._db.database.list("/teams/" + team);//{ query: { orderByChild: "name", equalTo: me } 
    }

    private JoinTeam(team: string, me: string): Observable<any>
    {
        let ret = new Subject();

        if (this._gps.lastPosition == null) console.log("LAST POS == NULL");


        console.log("Last position: " + JSON.stringify(this._gps.lastPosition));


        console.log(`Adding "${ me }" (at ${ this._gps.lastPosition.latitude }/${ this._gps.lastPosition.longitude }) to "${ team }"...`);

        this._db.database.list("/teams/" + team).push({ name: me, latitude: this._gps.lastPosition.latitude, longitude: this._gps.lastPosition.longitude }).then((x) =>
        {
            console.log(`Added with key "${ x.key }".`);
            ret.next(x.key);
        });

        return ret;
    }

    public TryJoinTeam(team, user): Observable<Teammate[]>
    {
        console.log(`TryJoinTeam(${ team }, ${ user })`);

        let ret = new Subject();

        if (this.IsLoggedIn())
        {
            this.Detach();
        }

        let getTeammatesSubscription = this.GetTeammates(team).subscribe((teammates) =>
        {
            console.log("Teammates: " + JSON.stringify(teammates));

            getTeammatesSubscription.unsubscribe(); // TODO zamiast tego wypróbować first albo take(1) albo coś podobnego

            if (teammates.find(teammate => teammate.name == user))
            {
                ret.error("TRY ANOTHER NAME. THIS ONE IS ALREADY TAKEN.");
            }
            else
            {
                console.log("User name is free. Joining to team...");

                this.JoinTeam(team, user).subscribe((key) =>
                {
                    console.log("Joined.");

                    this.team = team;
                    this.user = user;
                    this.myKeyInDb = key;

                    ret.next();

                    this.UpdateLocationInDb(this._gps.lastPosition);

                    this.currentTeam = this._db.database.list("/teams/" + team).subscribe((teammates: Teammate[]) =>
                    {
                        console.log("currentTeam: " + JSON.stringify(teammates));

                        this.teammates.next(teammates);
                    });
                });

            }
        })

        return ret;
    }

    public Detach(): Observable<any>
    {
        let ret = new Subject();

        this.teammates.next([]);
        this.currentTeam.unsubscribe();

        this._db.database.list("/teams/" + this.team).remove(this.myKeyInDb).then(() =>
        {
            ret.next("DETACHED");
        })

        return ret;
    }
}
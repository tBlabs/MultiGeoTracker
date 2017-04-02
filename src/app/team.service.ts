import { NavigatorService } from './navigator.service';
import { Subject } from 'rxjs/Subject';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


export interface ITeamService
{
    TryJoinTeam(team, user): Observable<any>;
    Detach(): Observable<any>;
}

@Injectable()
export class TeamService implements ITeamService
{
    private team: string;
    private user: string;
    private myKeyInDb: any = null;

    public Test()
    {
        this._gps.ForcePositionChange();
    }

    constructor(private _db: AngularFire, private _gps: NavigatorService)
    {
        _gps.position.subscribe((position: Coordinates) =>
        {
            console.log(position);

            this.UpdateLocation(position)
        });
    }

    private UpdateLocation(position: Coordinates)
    {
        if (this.myKeyInDb != null)
        {
            this._db.database.list("/teams/" + this.team).update(this.myKeyInDb, { pos: position }).then(() =>
            {
                console.log("Position updated");
            });
        }
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

        console.log(`Adding "${ me }" to "${ team }"...`);

        this._db.database.list("/teams/" + team).push({ name: me, pos: this._gps.lastPosition }).then((x) =>
        {
            console.log(`Added with key "${ x.key }"`);
            ret.next(x.key);
        });

        return ret;
    }

    public TryJoinTeam(team, user): Observable<any>
    {
        let ret = new Subject();

        if (this.IsLoggedIn())
        {
            this.Detach();
        }

        let getTeammatesSubscription = this.GetTeammates(team).subscribe((teammates) =>
        {
            getTeammatesSubscription.unsubscribe(); // THIS IS BAD !!!!!! zamiast tego wypróbować first albo take(1) albo coś podobnego

            if (teammates.find(teammate => teammate.name == user))
            {
                ret.error("TRY ANOTHER NAME. THIS ONE IS ALREADY TAKEN.");
            }
            else
            {
                this.JoinTeam(team, user).subscribe((key) =>
                {
                    this.team = team;
                    this.user = user;
                    this.myKeyInDb = key;

                    ret.next("JOINED");

                    this.UpdateLocation(this._gps.lastPosition);
                });

            }
        })

        return ret;
    }

    public Detach(): Observable<any>
    {
        let ret = new Subject();

        this._db.database.list("/teams/" + this.team).remove(this.myKeyInDb).then(() =>
        {
            ret.next("DETACHED");
        })

        return ret;
    }
}
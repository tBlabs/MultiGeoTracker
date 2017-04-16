import { Teammate } from './../models/teammate.model';
import { TeamService } from './../services/team.service';
import { Component, OnInit, Input } from '@angular/core';

export class MarkerX
{
  latitude: number;
  longitude: number;
  label: string;
}

@Component({
  selector: 'map',
  template: `
      <sebm-google-map [latitude]="centerLatitude"
                       [longitude]="centerLongitude">
          <sebm-google-map-marker *ngFor="let m of markers"
                                 [latitude]="m.latitude" 
                                 [longitude]="m.longitude" 
                                 [label]="m.label">
          </sebm-google-map-marker>
      </sebm-google-map>
 
  `,
  styles: ['.sebm-google-map-container { height: 700px; width: 100% }']
})
export class MapComponent 
{
  markers: MarkerX[] = [];

  centerLatitude: number = 52;
  centerLongitude: number = 22;

  Center(x, y)
  {
    this.centerLatitude = x;
    this.centerLongitude = y;
  }

  constructor(private _team: TeamService)
  {
    _team.teammates.subscribe((teammates: Teammate[]) =>
    {
      console.log("Updating markers...");
      let m = [];
      for (let i = 0; i < teammates.length; i++)
      {
        console.log(`(+) ${ teammates[i].name } ${ teammates[i].latitude }/${ teammates[i].longitude }`);
        m.push({ label: teammates[i].name, latitude: teammates[i].latitude, longitude: teammates[i].longitude });
      }
      this.markers = m;
    });
  }

}

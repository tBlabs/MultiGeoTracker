import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService
{
  public position = new Subject<Coordinates>();
  public lastPosition: Coordinates;


  constructor() 
  {
    if (navigator.geolocation)
    {
      console.log("Navigator avaliable");

      navigator.geolocation.watchPosition((p: Position) =>
      {
        console.log("Position changed to " + p.coords.latitude + "/" + p.coords.longitude + " @" + p.timestamp);

        let coords: Coordinates = p.coords;
        this.lastPosition = coords;

        this.position.next(coords);
      },
        (e: PositionError) =>
        {
          this.position.error(e.code);
        },
        {
          enableHighAccuracy: true,
          timeout: 30 * 1000,
          maximumAge: 1 * 100
        });
    }
    else this.position.error("NAVIGATION UNAVALIABLE");
  }
}

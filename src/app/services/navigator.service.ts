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
        let coords: Coordinates = p.coords;

        if (this.CoordsCompare(this.lastPosition, coords) == false)
        { 
          console.log("Position changed/updated to " + coords.latitude + "/" + coords.longitude + " @" + p.timestamp);

          this.position.next(coords);
          this.lastPosition = coords;
        }     
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

  private CoordsCompare(a: Coordinates, b: Coordinates): boolean
  {
    if ((a != null) && (b != null))
    {
      if ((a.latitude == b.latitude) && (a.longitude == b.longitude))
      {
        return true;
      }
    }

    return false;
  }
}

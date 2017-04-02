import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService
{
  public position = new Subject<Coordinates>();
  public lastPosition: Coordinates ;//= new Coordinates();

lat=52.00;
lon=22.00;
  public ForcePositionChange()
  {

       let coords: Coordinates= { latitude: this.lat++, longitude: this.lon++,
          accuracy: 100, altitude: 100, altitudeAccuracy:100, heading: 100, speed:100};
          this.lastPosition = coords;
  
          this.position.next(coords);
  }

  constructor() 
  {
    if (navigator.geolocation)
    {
      console.log("Navigator avaliable");
      
        navigator.geolocation.watchPosition((p: Position) =>
        {
          console.log("Position changed");
          
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

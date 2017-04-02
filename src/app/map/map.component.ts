import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'map',
  template: `
  <!--
  <sebm-google-map [latitude]="lat" [longitude]="lng">
    <sebm-google-map-marker [latitude]="lat" [longitude]="lng"></sebm-google-map-marker>
  </sebm-google-map>
  -->
  `
  ,
  styles: ['.sebm-google-map-container { height: 300px;}']
})
export class MapComponent implements OnInit
{
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor() { }

  ngOnInit()
  {
  }

}

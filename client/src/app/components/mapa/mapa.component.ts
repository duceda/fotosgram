import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit, AfterViewInit {
  @Input() coords: string;
  @ViewChild('mapa') mapa;

  constructor() {}

  ngOnInit() {
    console.log(this.coords);
  }

  ngAfterViewInit() {
    if (this.coords) {
      const latLng = this.coords.split(',');
      const lat = Number(latLng[0]);
      const lng = Number(latLng[1]);

      mapboxgl.accessToken = environment.mapBoxApiKey;
      const map = new mapboxgl.Map({
        // se puede usar como container un id o una referencia, que es mejor si
        // tenemos varios mapas  con un mismo id
        // container: 'map',
        container: this.mapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 15,
      });

      const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    }
  }
}

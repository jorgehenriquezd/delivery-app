import { Component, OnInit } from '@angular/core';
import * as Mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  map: Mapboxgl.Map

  long;
  lat;


  constructor() { }

  ngOnInit() {
    (Mapboxgl as any).accessToken = 'pk.eyJ1Ijoiam9yZ2VkZXYiLCJhIjoiY2tldnBkNjJoMGQ0eTJzbm91bWt6bXk5cyJ9.S4JV455i_-aiz9kmV9ta5A';
    this.map = new Mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-67.0545268, 10.3499829], // starting position
      zoom: 14,
      pitch: 40,
      bearing: 20,
      antialias: true
    });


    var geojson = {
      'type': 'FeatureCollection',
      'features': [
      {
      'type': 'Feature',
      'properties': {
      'message': 'Foo',
      'iconSize': [60, 60]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-66.324462890625, -16.024695711685304]
      }
      },
      {
      'type': 'Feature',
      'properties': {
      'message': 'Bar',
      'iconSize': [50, 50]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-61.2158203125, -15.97189158092897]
      }
      },
      {
      'type': 'Feature',
      'properties': {
      'message': 'Baz',
      'iconSize': [40, 40]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-63.29223632812499, -18.28151823530889]
      }
      }
      ]
      };

    this.map.on('load', function () {
      this.map.addSource('floorplan', {
        // GeoJSON Data source used in vector tiles, documented at
        // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        'type': 'geojson',
        'data':
          'https://docs.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson'
      });
      this.map.addLayer({
        'id': 'room-extrusion',
        'type': 'fill-extrusion',
        'source': 'floorplan',
        'paint': {
          // See the Mapbox Style Specification for details on data expressions.
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

          // Get the fill-extrusion-color from the source 'color' property.
          'fill-extrusion-color': ['get', 'color'],

          // Get fill-extrusion-height from the source 'height' property.
          'fill-extrusion-height': ['get', 'height'],

          // Get fill-extrusion-base from the source 'base_height' property.
          'fill-extrusion-base': ['get', 'base_height'],

          // Make extrusions slightly opaque for see through indoor walls.
          'fill-extrusion-opacity': 0.5
        }
      });
    }); 

this.Marker(-67.0545268, 10.3499829)


  }

Marker(long, lat){

  const marker = new Mapboxgl.Marker({
    draggable: true
  })
    .setLngLat([long, lat])
    .addTo(this.map);

  marker.on('drag', () => {
    this.long = marker.getLngLat().lng.toString();
    this.lat = marker.getLngLat().lat.toString();
  })
}

}

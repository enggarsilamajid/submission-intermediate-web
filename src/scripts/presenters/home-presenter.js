import API from '../data/api';

import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

L.Marker.prototype.options.icon = DefaultIcon;

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._map = null;
    this._markers = [];
  }

  async init() {
    try {
      const response = await API.getStories();
      let stories = response.listStory;

      if (!stories || stories.length === 0) {
        stories = [
          {
            name: 'Dummy User',
            description: 'Ini data dummy',
            photoUrl: 'https://via.placeholder.com/150',
            lat: -6.2,
            lon: 106.8,
          },
        ];
      }

      this._view.renderStories(stories);
      this._initMap();
      this._addMarkers(stories);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    this._map = L.map('map').setView([-2.5, 118], 5);

    const osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap' }
);

const osmBW = L.tileLayer(
  'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap' }
);

osm.addTo(this._map);
L.control.layers(baseMaps).addTo(this._map);

    const satelliteLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap HOT' }
    );

    defaultLayer.addTo(this._map);

    const baseMaps = {
      "Default": defaultLayer,
      "Satellite": satelliteLayer,
    };

    L.control.layers(baseMaps).addTo(this._map);
  }

  _addMarkers(stories) {
  console.log('MARKER DATA:', stories);

  stories.forEach((story) => {
    console.log(story.lat, story.lon);

    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon])
        .addTo(this._map)
        .bindPopup(`
          <b>${story.name}</b><br/>
          ${story.description}
        `);

      marker.on('click', () => {
        this._markers.forEach(m => m.setOpacity(1));
        marker.setOpacity(0.5);
      });

      this._markers.push(marker);
    }
  });

  if (this._markers.length > 0) {
  const group = L.featureGroup(this._markers);
  this._map.fitBounds(group.getBounds());
}
}
}
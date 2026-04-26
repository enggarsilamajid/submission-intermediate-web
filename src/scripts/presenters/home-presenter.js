import API from '../data/api';
import L from 'leaflet';

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

    const defaultLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap' }
    );

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
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`
            <b>${story.name}</b><br/>
            ${story.description}
          `);

        marker.on('click', () => {
          marker.setOpacity(0.5);
        });

        this._markers.push(marker);
      }
    });
  }
}
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
      console.log('GET STORIES:', response);

      let stories = response.listStory || [];

      this._view.renderStories(stories);

      this._initMap();
      this._addMarkers(stories);

      setTimeout(() => {
        this._map.invalidateSize();
      }, 300);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    this._map = L.map('map').setView([-2.5, 118], 5);

    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    );

    osm.addTo(this._map);
  }

  _addMarkers(stories) {
    this._markers = [];

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map);

        this._markers.push(marker);
      }
    });
  }
}
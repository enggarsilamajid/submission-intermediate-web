import API from '../data/api';
import L from 'leaflet';

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._map = null;
  }

  async init() {
    try {
      const response = await API.getStories();
      const stories = response.listStory || [];

      this._view.renderStories(stories);

      this._initMap();
      this._addMarkers(stories);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    this._map = L.map('map').setView([-2.5, 118], 5);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this._map);
  }

  _addMarkers(stories) {
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`
            <b>${story.name}</b><br/>
            <small>${new Date(story.createdAt).toLocaleDateString('id-ID')}</small><br/>
            ${story.description}
          `);
      }
    });
  }
}
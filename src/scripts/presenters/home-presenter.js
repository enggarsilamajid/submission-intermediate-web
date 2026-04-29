import API from '../data/api';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

      setTimeout(() => {
        this._map.invalidateSize();
      }, 300);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    this._map = L.map('map', {
      zoomControl: true,
    }).setView([-2.5, 118], 5);

    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri',
      }
    );

    osm.addTo(this._map);

    const baseMaps = {
      Default: osm,
      Satellite: satellite,
    };

    L.control.layers(baseMaps, null, {
      position: 'topright',
      collapsed: true,
    }).addTo(this._map);
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
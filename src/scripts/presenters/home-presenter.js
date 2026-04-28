import API from '../data/api';
import L from 'leaflet';

// FIX ICON
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
L.Marker.prototype.options.icon = DefaultIcon;

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._map = null;
    this._markers = [];
  }

  async init() {
    try {
      const response = await API.getStories();
      const stories = response?.listStory || [];

      this._view.renderStories(stories);

      // 🔥 TUNGGU LAYOUT BENAR-BENAR STABIL
      requestAnimationFrame(() => {
        setTimeout(() => {
          this._initMap();
          this._addMarkers(stories);

          // 🔥 INI KUNCI UTAMA FIX MARKER
          setTimeout(() => {
            this._map.invalidateSize();
          }, 300);

        }, 50);
      });

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

    L.control.layers(
      {
        Default: osm,
        Satellite: satellite,
      },
      null,
      {
        position: 'topright',
        collapsed: true,
      }
    ).addTo(this._map);
  }

  _addMarkers(stories) {
    this._markers = [];

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`
            <b>${story.name}</b><br/>
            ${story.description}
          `);

        this._markers.push(marker);
      }
    });

    if (this._markers.length > 0) {
      const group = L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds(), {
        padding: [50, 50],
      });
    }
  }
}
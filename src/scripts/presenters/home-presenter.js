import API from '../data/api';
import L from 'leaflet';

// ✅ FIX ICON (biar marker selalu muncul)
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
      console.log('GET STORIES:', response);

      let stories = response.listStory || [];

      this._view.renderStories(stories);

      this._initMap();
      this._addMarkers(stories);

      // 🔥 penting untuk mencegah map “geser”
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

    // ✅ DEFAULT MAP (OSM)
    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    // ✅ SATELLITE MAP (ESRI)
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri',
      }
    );

    // aktifkan default
    osm.addTo(this._map);

    // ✅ layer switcher
    const baseMaps = {
      'Default': osm,
      'Satellite': satellite,
    };

    L.control.layers(baseMaps, null, {
      position: 'topright', // 🔥 BONUS posisi
      collapsed: false,     // 🔥 BONUS selalu terbuka (optional)
    }).addTo(this._map);
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

    // ✅ zoom ke semua marker
    if (this._markers.length > 0) {
      const group = L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds(), {
        padding: [50, 50],
      });
    }
  }
}
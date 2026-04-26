import API from '../data/api';
import L from 'leaflet';

// ✅ FIX ICON (CDN)
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
      let stories = response.listStory;

      if (!stories || stories.length === 0) {
        stories = [{
          name: 'Dummy User',
          description: 'Ini data dummy',
          photoUrl: 'https://via.placeholder.com/150',
          lat: -6.2,
          lon: 106.8,
        }];
      }

      this._view.renderStories(stories);

      // 🔥 TUNGGU DOM BENAR-BENAR SIAP (bukan setTimeout tebak-tebakan)
      await new Promise((resolve) => requestAnimationFrame(resolve));

      this._initMap();
      this._addMarkers(stories);

      // 🔥 FINAL SYNC (sekali, setelah semua siap)
      setTimeout(() => {
        this._map.invalidateSize();
      }, 100);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    const el = document.getElementById('map');

    // safety: pastikan elemen ada & punya tinggi
    if (!el) throw new Error('Element #map tidak ditemukan');
    if (el.offsetHeight === 0) {
      console.warn('Map height 0 → cek CSS #map height');
    }

    // ❌ JANGAN setView berkali-kali, cukup sekali di sini
    this._map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([-6.2, 106.8], 10);

    // ✅ Default layer
    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    // ✅ Satellite layer (untuk Kriteria Advanced)
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri',
      }
    );

    osm.addTo(this._map);

    // ✅ Layer control
    L.control.layers({
      Default: osm,
      Satellite: satellite,
    }).addTo(this._map);

    // 🔥 Penting: sync saat map ready
    this._map.whenReady(() => {
      this._map.invalidateSize();
    });
  }

  _addMarkers(stories) {
    this._markers = [];

    stories.forEach((story) => {
      if (story.lat != null && story.lon != null) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`
            <b>${story.name}</b><br/>
            ${story.description}
          `);

        marker.on('click', () => {
          this._resetMarkerOpacity();
          marker.setOpacity(0.5);
        });

        this._markers.push(marker);
      }
    });

    // ❌ HAPUS semua fitBounds & setView ulang di sini
    // (ini sumber utama marker "geser")

    // interaksi reset
    this._map.on('click', () => {
      this._resetMarkerOpacity();
    });

    this._map.on('popupclose', () => {
      this._resetMarkerOpacity();
    });
  }

  _resetMarkerOpacity() {
    this._markers.forEach((m) => m.setOpacity(1));
  }
}
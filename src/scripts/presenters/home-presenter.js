import API from '../data/api';
import L from 'leaflet';

// ✅ FIX ICON
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

      // 🔥 tunggu DOM stabil
      await new Promise((r) => requestAnimationFrame(r));

      this._initMap();
      this._addMarkers(stories);

      // 🔥 FINAL FIX (WAJIB)
      this._fixMap();

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    const el = document.getElementById('map');

    if (!el) throw new Error('Element #map tidak ditemukan');

    this._map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([-6.2, 106.8], 10);

    // default layer
    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    );

    // satellite layer
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles © Esri' }
    );

    osm.addTo(this._map);

    // layer control
    L.control.layers({
      Default: osm,
      Satellite: satellite,
    }).addTo(this._map);

    // 🔥 AUTO FIX kalau ukuran berubah
    const observer = new ResizeObserver(() => {
      this._fixMap();
    });

    observer.observe(el);
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

    // reset marker
    this._map.on('click', () => {
      this._resetMarkerOpacity();
    });

    this._map.on('popupclose', () => {
      this._resetMarkerOpacity();
    });
  }

  // 🔥 CORE FIX (INI YANG NGILANGIN BUG GESER)
  _fixMap() {
    if (!this._map) return;

    const center = this._map.getCenter();
    const zoom = this._map.getZoom();

    this._map.invalidateSize();

    this._map.setView(center, zoom, { animate: false });
  }

  _resetMarkerOpacity() {
    this._markers.forEach((m) => m.setOpacity(1));
  }
}
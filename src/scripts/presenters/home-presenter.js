import API from '../data/api';
import L from 'leaflet';

// ✅ FIX ICON (pakai CDN saja, HAPUS import markerIcon lokal)
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

      // fallback dummy
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

      // 🔥 FIX: cegah map “geser” karena resize/transition
      setTimeout(() => {
  this._map.invalidateSize();
  this._map.setView(this._map.getCenter()); // 🔥 paksa re-render posisi
}, 500);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
    this._map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([-2.5, 118], 5);

    // ✅ DEFAULT
    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    // ✅ SATELLITE (AMAN TANPA API KEY)
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
      }
    );

    osm.addTo(this._map);

    const baseMaps = {
      "Default": osm,
      "Satellite": satellite,
    };

    L.control.layers(baseMaps).addTo(this._map);

    window.addEventListener('resize', () => {
  if (this._map) {
    this._map.invalidateSize();
  }
});
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

        // ✅ klik marker → highlight
        marker.on('click', () => {
          this._resetMarkerOpacity();
          marker.setOpacity(0.5);
        });

        this._markers.push(marker);
      }
    });

    // ✅ FIT KE SEMUA MARKER
    if (this._markers.length > 0) {
      const group = L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // ✅ klik peta → reset marker
    this._map.on('click', () => {
      this._resetMarkerOpacity();
    });

    // ✅ tutup popup → reset marker
    this._map.on('popupclose', () => {
      this._resetMarkerOpacity();
    });
  }

  _resetMarkerOpacity() {
    this._markers.forEach((m) => m.setOpacity(1));
  }
}
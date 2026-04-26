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

      // 🔥 pastikan DOM siap
      setTimeout(() => {
        this._initMap();
        this._addMarkers(stories);
      }, 100);

    } catch (error) {
      this._view.renderError(error.message);
    }
  }

  _initMap() {
  const mapElement = document.getElementById('map');

  // 🔍 DEBUG WAJIB
  console.log('MAP ELEMENT:', mapElement);
  console.log('MAP HEIGHT:', mapElement?.offsetHeight);

  this._map = L.map(mapElement);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
    }
  ).addTo(this._map);

  // 🔥 set view SETELAH tile
  this._map.setView([-6.2, 106.8], 10);

  // 🔥 paksa Leaflet hitung ulang ukuran
  setTimeout(() => {
    this._map.invalidateSize();
  }, 200);

  this._map.whenReady(() => {
  this._map.invalidateSize();
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

        marker.on('click', () => {
          this._resetMarkerOpacity();
          marker.setOpacity(0.5);
        });

        this._markers.push(marker);
      }
    });

    if (this._markers.length > 0) {
  const first = this._markers[0].getLatLng();

  // 🔥 pakai setView (STABIL)
  this._map.setView([first.lat, first.lng], 10);
}

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
import API from '../data/api';
import L from 'leaflet';

export default class AddPresenter {
  constructor({ view }) {
    this._view = view;
    this._map = null;
    this._marker = null;
    this._lat = null;
    this._lon = null;
  }

  init() {
    this._initMap();
    this._initForm();
  }

  _initMap() {
    this._map = L.map('map').setView([-6.2, 106.8], 10);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
    ).addTo(this._map);

    this._map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      this._lat = lat;
      this._lon = lng;

      this._view.updateLatLon(lat, lng);

      // 🔥 marker hanya 1 (tidak nambah)
      if (this._marker) {
        this._marker.setLatLng([lat, lng]);
      } else {
        this._marker = L.marker([lat, lng]).addTo(this._map);
      }
    });

    setTimeout(() => {
      this._map.invalidateSize();
    }, 300);
  }

  _initForm() {
    const form = document.querySelector('#story-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.querySelector('#description').value;
      const file = document.querySelector('#photo-file').files[0];

      if (!this._lat || !this._lon) {
        this._view.showError('Pilih lokasi terlebih dahulu');
        return;
      }

      try {
        window.showLoading();

        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', file);
        formData.append('lat', this._lat);
        formData.append('lon', this._lon);

        await API.addStory(formData);

        this._view.showSuccess('Data berhasil dikirim');

        setTimeout(() => {
          window.location.hash = '#/';
        }, 1000);

      } catch (error) {
        this._view.showError(error.message);
      } finally {
        window.hideLoading();
      }
    });
  }
}
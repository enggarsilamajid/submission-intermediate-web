import API from '../data/api';
import L from 'leaflet';

export default class AddPresenter {
  constructor({ view }) {
    this._view = view;
    this._map = null;
    this._lat = null;
    this._lon = null;
    this._stream = null;
  }

  async init() {
    this._initMap();
    this._initForm();
    this._initCamera();
  }

  _initMap() {
    this._map = L.map('map').setView([-6.2, 106.8], 10);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap' }
    ).addTo(this._map);

    this._map.on('click', (e) => {
      this._lat = e.latlng.lat;
      this._lon = e.latlng.lng;

      this._view.updateLatLon(this._lat, this._lon);

      L.marker([this._lat, this._lon]).addTo(this._map);
    });
  }

  _initForm() {
    const form = document.getElementById('story-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value;
      const fileInput = document.getElementById('photo');
      const file = fileInput.files[0];

      if (!description || !file || !this._lat || !this._lon) {
        this._view.showMessage('Semua field wajib diisi!');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', file);
        formData.append('lat', this._lat);
        formData.append('lon', this._lon);

        await API.addStory(formData);

        this._view.showMessage('Berhasil tambah data!');
      } catch (err) {
        this._view.showMessage('Gagal kirim data');
      }
    });
  }

  _initCamera() {
    const btn = document.getElementById('open-camera');
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('snapshot');

    btn.addEventListener('click', async () => {
      this._stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = this._stream;
      video.style.display = 'block';

      setTimeout(() => {
        canvas.getContext('2d').drawImage(video, 0, 0, 200, 150);

        canvas.toBlob((blob) => {
          const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });

          const fileInput = document.getElementById('photo');
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.files = dt.files;
        });

        this._stream.getTracks().forEach((t) => t.stop());
        video.style.display = 'none';
      }, 2000);
    });
  }
}
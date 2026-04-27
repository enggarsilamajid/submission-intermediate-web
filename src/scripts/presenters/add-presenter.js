import API from '../data/api';
import L from 'leaflet';

export default class AddPresenter {
  constructor({ view }) {
    this._view = view;

    this._map = null;
    this._selectedMarker = null;
    this._selectedLat = null;
    this._selectedLon = null;

    this._stream = null;
    this._facingMode = 'environment';
    this._capturedBlob = null;
  }

  init() {
    this._initMap();
    this._initCamera();
    this._initForm();
  }

  _initMap() {
    this._map = L.map('map').setView([-6.2, 106.8], 10);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this._map);

    this._map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      this._selectedLat = lat;
      this._selectedLon = lng;

      if (this._selectedMarker) {
        this._map.removeLayer(this._selectedMarker);
      }

      this._selectedMarker = L.marker([lat, lng]).addTo(this._map);

      this._view.updateLatLon(lat, lng);
    });
  }

  _initCamera() {
    const startBtn = document.querySelector('#btn-start-camera');
    const captureBtn = document.querySelector('#btn-capture');
    const switchBtn = document.querySelector('#btn-switch');

    startBtn.addEventListener('click', async () => {
      await this._startCamera();
    });

    switchBtn.addEventListener('click', async () => {
      this._facingMode =
        this._facingMode === 'environment' ? 'user' : 'environment';
      await this._startCamera();
    });

    captureBtn.addEventListener('click', async () => {
      this._capturedBlob = await this._takePhoto();
      alert('Foto berhasil diambil');
      this._stopCamera();
    });
  }

  async _startCamera() {
    try {
      if (this._stream) this._stopCamera();

      this._stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this._facingMode },
      });

      this._view.showCamera(this._stream);
    } catch (err) {
      alert('Gagal akses kamera');
    }
  }

  _stopCamera() {
    if (this._stream) {
      this._stream.getTracks().forEach((t) => t.stop());
      this._stream = null;
    }
  }

  async _takePhoto() {
    const video = document.querySelector('#camera-preview');
    const canvas = document.querySelector('#snapshot');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  }

  _initForm() {
    document.querySelector('#story-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.querySelector('#description').value;

      if (!this._capturedBlob) {
        alert('Ambil foto dulu');
        return;
      }

      if (!this._selectedLat || !this._selectedLon) {
        alert('Pilih lokasi di peta');
        return;
      }

      await this._submitData({
        description,
        photo: this._capturedBlob,
      });
    });
  }

  async _submitData({ description, photo }) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      formData.append('lat', this._selectedLat);
      formData.append('lon', this._selectedLon);

      await API.addStory(formData);

      alert('Berhasil tambah data');

      window.location.hash = '/';
    } catch (err) {
      console.error(err);
      alert('Gagal kirim: ' + err.message);
    }
  }
}
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
  }

  async init() {
    this._initMap();
    this._initCamera();
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
    document.querySelector('#open-camera').addEventListener('click', async () => {
      try {
        this._stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        this._view.showCamera(this._stream);
      } catch (error) {
        alert('Tidak bisa akses kamera');
      }
    });
  }

  stopCamera() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
  }

  async takePhoto() {
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
      const fileInput = document.querySelector('#photo');

      let photo = fileInput.files[0];

      if (!photo && this._stream) {
        photo = await this.takePhoto();
      }

      await this._submitData({ description, photo });
    });
  }

  async _submitData({ description, photo }) {
    try {
      if (!this._selectedLat || !this._selectedLon) {
        alert('Pilih lokasi dulu di peta');
        return;
      }

      if (!photo) {
        alert('Upload atau ambil foto dulu');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      formData.append('lat', this._selectedLat);
      formData.append('lon', this._selectedLon);

      await API.addStory(formData);

      alert('Berhasil tambah data!');

      this.stopCamera();

      window.location.hash = '/';
    } catch (error) {
      console.error(error);
      alert('Gagal kirim data: ' + error.message);
    }
  }
}
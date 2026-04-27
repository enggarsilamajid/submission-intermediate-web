import AddPresenter from '../../presenters/add-presenter';

export default class AddPage {
  async render() {
    return `
      <section>
        <h1>Tambah Data</h1>

        <form id="story-form">
          <label>Deskripsi</label><br/>
          <input id="description" type="text" required /><br/><br/>

          <!-- CAMERA -->
          <video id="camera-preview" autoplay playsinline style="width:100%; max-width:300px; display:none;"></video>
          <canvas id="snapshot" style="display:none;"></canvas>

          <div style="margin:10px 0;">
            <button type="button" id="btn-start-camera">Buka Kamera</button>
            <button type="button" id="btn-capture">Ambil Gambar</button>
            <button type="button" id="btn-switch">Ganti Kamera</button>
          </div>

          <br/>

          <p>Klik peta untuk memilih lokasi</p>
          <div id="map" style="height:300px;"></div>

          <p id="latlon"></p>

          <br/>
          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._presenter = new AddPresenter({ view: this });
    this._presenter.init();
  }

  updateLatLon(lat, lon) {
    document.querySelector('#latlon').innerText =
      `Lat: ${lat}, Lon: ${lon}`;
  }

  showCamera(stream) {
    const video = document.querySelector('#camera-preview');
    video.srcObject = stream;
    video.style.display = 'block';
  }
}
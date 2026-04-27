import AddPresenter from '../../presenters/add-presenter';

export default class AddPage {
  async render() {
    return `
      <section>
        <h1>Tambah Data</h1>

        <form id="story-form">
          <!-- DESKRIPSI -->
          <label>Deskripsi</label><br/>
          <input id="description" type="text" required /><br/><br/>

          <!-- UPLOAD FILE -->
          <label>Upload Gambar</label><br/>
          <input type="file" id="photo-file" accept="image/*" /><br/><br/>

          <!-- CAMERA -->
          <button type="button" id="btn-start-camera">Buka Kamera</button>

          <div id="camera-section" style="display:none;">
            <video id="camera-preview" autoplay playsinline style="width:100%; max-width:300px;"></video>

            <div>
              <button type="button" id="btn-capture">Ambil Gambar</button>
              <button type="button" id="btn-switch">Ganti Kamera</button>
            </div>
          </div>

          <!-- PREVIEW -->
          <div id="preview-section" style="display:none;">
            <img id="preview-image" style="width:100%; max-width:300px;" />
            <br/>
            <button type="button" id="btn-retake">Ambil Ulang</button>
          </div>

          <canvas id="snapshot" style="display:none;"></canvas>

          <!-- MAP -->
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

    document.querySelector('#camera-section').style.display = 'block';
    document.querySelector('#preview-section').style.display = 'none';
  }

  showPreview(imageUrl) {
    const img = document.querySelector('#preview-image');
    img.src = imageUrl;

    document.querySelector('#camera-section').style.display = 'none';
    document.querySelector('#preview-section').style.display = 'block';
  }

  hideCamera() {
    document.querySelector('#camera-section').style.display = 'none';
  }
}
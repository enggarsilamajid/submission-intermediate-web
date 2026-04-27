import AddPresenter from '../../presenters/add-presenter';

export default class AddPage {
  async render() {
    return `
      <section>
        <h1>Tambah Data</h1>

        <form id="story-form">
          <!-- DESKRIPSI -->
          <div>
            <label for="description">Deskripsi</label>
            <input 
              id="description" 
              type="text" 
              required 
              aria-required="true"
            />
          </div>

          <!-- UPLOAD FILE -->
          <div>
            <label for="photo-file">Upload Gambar</label>
            <input 
              type="file" 
              id="photo-file" 
              accept="image/*"
              aria-describedby="photo-help"
            />
            <small id="photo-help">
              Pilih gambar dari perangkat atau gunakan kamera
            </small>
          </div>

          <!-- CAMERA BUTTON -->
          <button 
            type="button" 
            id="btn-start-camera"
            aria-controls="camera-section"
            aria-expanded="false"
          >
            Buka Kamera
          </button>

          <!-- CAMERA -->
          <div 
            id="camera-section" 
            style="display:none;"
            aria-hidden="true"
          >
            <video 
              id="camera-preview" 
              autoplay 
              playsinline
              aria-label="Tampilan kamera aktif"
              style="width:100%; max-width:300px;"
            ></video>

            <div>
              <button type="button" id="btn-capture">
                Ambil Gambar
              </button>

              <button type="button" id="btn-switch">
                Ganti Kamera
              </button>
            </div>
          </div>

          <!-- PREVIEW -->
          <div 
            id="preview-section" 
            style="display:none;"
            aria-live="polite"
          >
            <img 
              id="preview-image" 
              alt="Hasil gambar yang diambil"
              style="width:100%; max-width:300px;"
            />

            <br/>

            <button type="button" id="btn-retake">
              Ambil Ulang
            </button>
          </div>

          <canvas id="snapshot" hidden></canvas>

          <!-- MAP -->
          <p>Klik peta untuk memilih lokasi</p>

          <div 
            id="map"
            role="application"
            aria-label="Peta untuk memilih lokasi"
            tabindex="0"
            style="height:300px;"
          ></div>

          <p id="latlon" aria-live="polite"></p>

          <br/>

          <button type="submit">
            Kirim
          </button>
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
    const section = document.querySelector('#camera-section');
    const button = document.querySelector('#btn-start-camera');

    video.srcObject = stream;

    section.style.display = 'block';
    section.setAttribute('aria-hidden', 'false');

    button.setAttribute('aria-expanded', 'true');

    document.querySelector('#preview-section').style.display = 'none';
  }

  showPreview(imageUrl) {
    const img = document.querySelector('#preview-image');

    img.src = imageUrl;

    document.querySelector('#camera-section').style.display = 'none';
    document.querySelector('#preview-section').style.display = 'block';
  }

  hideCamera() {
    const section = document.querySelector('#camera-section');
    const button = document.querySelector('#btn-start-camera');

    section.style.display = 'none';
    section.setAttribute('aria-hidden', 'true');

    button.setAttribute('aria-expanded', 'false');
  }
}
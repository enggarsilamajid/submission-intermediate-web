import AddPresenter from '../../presenters/add-presenter';

export default class AddPage {
  async render() {
    return `
      <section>
        <h1>Tambah Data</h1>

        <form id="story-form">
          <label for="description">Deskripsi:</label><br/>
          <input type="text" id="description" required /><br/><br/>

          <label for="photo">Upload Gambar:</label><br/>
          <input type="file" id="photo" accept="image/*" /><br/><br/>

          <button type="button" id="open-camera">
            Gunakan Kamera
          </button><br/><br/>

          <video id="camera-preview" autoplay style="display:none; width:100%; max-width:300px;"></video>
          <canvas id="snapshot" style="display:none;"></canvas>

          <p>Klik peta untuk memilih lokasi</p>
          <div id="map" style="height:300px;"></div>

          <p id="latlon"></p>

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._presenter = new AddPresenter({
      view: this,
    });

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
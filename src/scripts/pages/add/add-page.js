import AddPresenter from '../../presenters/add-presenter';

export default class AddPage {
  async render() {
    return `
      <section>
        <h1>Tambah Story</h1>

        <form id="story-form">
          <label>
            Deskripsi:
            <input type="text" id="description" required />
          </label>

          <br/><br/>

          <label>
            Upload Gambar:
            <input type="file" id="photo" accept="image/*" required />
          </label>

          <br/><br/>

          <button type="button" id="open-camera">Gunakan Kamera</button>
          <video id="camera-preview" autoplay style="display:none; width:200px;"></video>
          <canvas id="snapshot" style="display:none;"></canvas>

          <br/><br/>

          <p>Klik peta untuk memilih lokasi</p>
          <div id="map" style="height:300px;"></div>

          <p id="latlon"></p>

          <button type="submit">Kirim</button>
        </form>

        <p id="message"></p>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new AddPresenter({ view: this });
    presenter.init();
  }

  showMessage(msg) {
    document.getElementById('message').innerText = msg;
  }

  updateLatLon(lat, lon) {
    document.getElementById('latlon').innerText =
      `Lat: ${lat}, Lon: ${lon}`;
  }
}
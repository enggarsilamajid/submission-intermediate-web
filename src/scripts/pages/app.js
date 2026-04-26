import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // 1. Fade out halaman lama
    this.#content.classList.remove('fade-in');
    this.#content.classList.add('fade-out');

    await new Promise((resolve) => setTimeout(resolve, 300));

    // 2. Render halaman baru
    this.#content.innerHTML = await page.render();

    // 3. 🔥 Fade-in DULU (biar layout stabil sebelum JS jalan)
    this.#content.classList.remove('fade-out');
    this.#content.classList.add('fade-in');

    // 4. Tunggu browser benar-benar render layout
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 5. 🔥 Baru jalankan logic halaman (Leaflet dibuat di sini)
    await page.afterRender();
  }
}

export default App;
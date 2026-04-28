import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    // this.#setupGlobalLoading();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', (event) => {
      event.stopPropagation();

      const isOpen = this.#navigationDrawer.classList.toggle('open');

      this.#drawerButton.setAttribute('aria-expanded', isOpen);
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', false);
      }
    });

    this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', false);
      });
    });

    window.addEventListener('hashchange', () => {
      this.#navigationDrawer.classList.remove('open');
      this.#drawerButton.setAttribute('aria-expanded', false);
    });
  }

  async renderPage() {
  const url = getActiveRoute();
  const page = routes[url];

  const isMapPage = url === '/' || url === '/add'; // 🔥 halaman yang pakai Leaflet

  // ❌ JANGAN animasi kalau ada map
  if (!isMapPage) {
    this.#content.classList.remove('fade-in');
    this.#content.classList.add('fade-out');

    await new Promise((r) => setTimeout(r, 300));
  }

  this.#content.innerHTML = await page.render();

  await new Promise((r) => requestAnimationFrame(r));

  await page.afterRender();

  this.#content.setAttribute('tabindex', '-1');
  this.#content.focus();

  // ❌ JANGAN animasi kalau ada map
  if (!isMapPage) {
    this.#content.classList.remove('fade-out');
    this.#content.classList.add('fade-in');
  }
}
}

export default App;
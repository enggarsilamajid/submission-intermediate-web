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
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    this.#content.classList.remove('fade-in');
    this.#content.classList.add('fade-out');

    await new Promise((r) => setTimeout(r, 300));

    this.#content.innerHTML = await page.render();

    this.#content.classList.remove('fade-out');
    this.#content.classList.add('fade-in');

    await new Promise((r) => requestAnimationFrame(r));

    await page.afterRender();
  }
}

export default App;
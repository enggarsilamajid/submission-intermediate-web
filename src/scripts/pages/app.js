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
  }

  _updateNav() {
    const token = localStorage.getItem('token');
    const navList = document.querySelector('#nav-list');
    if (!navList) return;

    let html = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/about">About</a></li>
    `;

    if (token) {
      html += `
        <li><a href="#/add">Tambah Data</a></li>
        <li><a href="#" id="logout-btn">Logout</a></li>
      `;
    } else {
      html += `
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `;
    }

    navList.innerHTML = html;

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', false);
      });
    });

    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.hash = '/login';
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    const render = async () => {
      this.#content.innerHTML = await page.render();
      this._updateNav();
      await page.afterRender();
    };

    if (document.startViewTransition) {
      await document.startViewTransition(render);
    } else {
      await render();
    }

    this.#content.setAttribute('tabindex', '-1');
    this.#content.focus();
  }
}

export default App;
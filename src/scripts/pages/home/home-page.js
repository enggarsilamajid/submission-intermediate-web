import HomePresenter from '../../presenters/home-presenter';

export default class HomePage {
  async render() {
    return `
      <section>
        <h1>Home</h1>

        <!-- 🔥 penting: pakai class + height fix -->
        <div id="map" class="map-container"></div>

        <div id="stories"></div>
      </section>
    `;
  }

  async afterRender() {
  // tunggu 1 frame + DOM benar-benar terpasang
  requestAnimationFrame(() => {
    setTimeout(() => {
      const presenter = new HomePresenter({ view: this });
      presenter.init();
    }, 0);
  });
}

  renderStories(stories) {
    const container = document.querySelector('#stories');

    if (!stories || stories.length === 0) {
      container.innerHTML = `<p>Tidak ada data</p>`;
      return;
    }

    container.innerHTML = stories.map((story) => `
      <div>
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
      </div>
    `).join('');
  }

  renderError(message) {
    document.querySelector('#stories').innerHTML = `
      <p>Error: ${message}</p>
    `;
  }
}
import HomePresenter from '../../presenters/home-presenter';

export default class HomePage {
  async render() {
    return `
      <section class="home-page">
        <h1>Home</h1>

        <h2>Peta Lokasi</h2>
        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <h2>Daftar Cerita</h2>
        <div id="stories"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new HomePresenter({ view: this });
    await presenter.init();
  }

  renderStories(stories) {
    const container = document.querySelector('#stories');

    if (!stories || stories.length === 0) {
      container.innerHTML = `<p>Tidak ada data</p>`;
      return;
    }

    container.innerHTML = `
      <div class="story-list">
        ${stories.map((story) => `
          <article class="story-card">
            <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" loading="lazy" />
            <div class="story-content">
              <h3>${story.name}</h3>
              <p>${new Date(story.createdAt).toLocaleDateString('id-ID')}</p>
              <p>${story.description}</p>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  renderError(message) {
    document.querySelector('#stories').innerHTML = `<p>${message}</p>`;
  }
}
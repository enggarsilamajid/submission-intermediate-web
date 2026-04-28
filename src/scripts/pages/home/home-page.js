import HomePresenter from '../../presenters/home-presenter';

export default class HomePage {
  async render() {
    return `
      <section>
        <h1>Home</h1>
        <div id="map"></div>
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
            <img src="${story.photoUrl}" alt="${story.name}" />

            <div class="story-content">
              <h3>${story.name}</h3>
              <p>${story.description}</p>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  renderError(message) {
    document.querySelector('#stories').innerHTML = `<p>Error: ${message}</p>`;
  }
}
import HomePresenter from '../../presenters/home-presenter';

export default class HomePage {
  async render() {
    return `
      <section class="home-page">
        <h1>Home</h1>

        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <div id="stories" class="stories-container"></div>
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
      container.innerHTML = `
        <p style="margin-top:16px;">Tidak ada data</p>
      `;
      return;
    }

    container.innerHTML = `
      <div class="story-list">
        ${stories.map((story) => `
          <article class="story-card">
            <img 
              src="${story.photoUrl}" 
              alt="Foto dari ${story.name}" 
              loading="lazy"
            />

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
    document.querySelector('#stories').innerHTML = `
      <p style="color:red; margin-top:16px;">
        Error: ${message}
      </p>
    `;
  }
}
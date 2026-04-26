import HomePresenter from '../../presenters/home-presenter';

export default class HomePage {
  async render() {
    return `
      <section>
        <h1>Home</h1>

        <div id="map" style="height: 300px;"></div>

        <div id="stories"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new HomePresenter({
      view: this,
    });

    presenter.init();
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
    <pre>${JSON.stringify(message)}</pre>
  `;
}
}

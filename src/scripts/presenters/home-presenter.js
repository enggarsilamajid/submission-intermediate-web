import API from '../data/api';

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async init() {
  try {
    const response = await API.getStories();

    let stories = response.listStory;

    if (!stories || stories.length === 0) {
      stories = [
        {
          name: 'Dummy User',
          description: 'Ini data dummy untuk testing',
          photoUrl: 'https://via.placeholder.com/150',
        },
      ];
    }

    this._view.renderStories(stories);
  } catch (error) {
    this._view.renderError(error.message);
  }
}
}
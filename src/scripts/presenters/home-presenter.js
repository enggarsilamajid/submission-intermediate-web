import API from '../data/api';

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async init() {
    try {
      const response = await API.getStories();
      const stories = response.listStory;

      this._view.renderStories(stories);
    } catch (error) {
      this._view.renderError(error.message);
    }
  }
}
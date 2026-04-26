import API from '../data/api';

export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async init() {
  try {
    const response = await API.getStories();

    console.log('RESPONSE:', response); // debug

    const stories = response.listStory || [];

    this._view.renderStories(stories);
  } catch (error) {
    this._view.renderError(error.message);
  }
}
}
import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

const API = {
  async getStories() {
    const response = await fetch(ENDPOINTS.STORIES);
    const responseJson = await response.json();

    return responseJson;
  },
};

export default API;
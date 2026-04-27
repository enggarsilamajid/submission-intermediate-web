import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

const API = {
  async getStories() {
    const res = await fetch(ENDPOINTS.STORIES);
    return res.json();
  },

  async addStory(formData) {
    const token = localStorage.getItem('token');

    const res = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json;
  },
};

export default API;
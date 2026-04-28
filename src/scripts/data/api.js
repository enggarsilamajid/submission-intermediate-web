import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

const API = {
  async getStories() {
    const token = localStorage.getItem('token');

    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    return responseJson;
  },

  async addStory(formData) {
    const token = localStorage.getItem('token');

    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();
    return responseJson;
  },

  async login({ email, password }) {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  },

  async register({ name, email, password }) {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    return await response.json();
  },
};

export default API;
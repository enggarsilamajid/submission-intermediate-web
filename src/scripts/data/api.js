import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
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

  async login({ email, password }) {
    const res = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json.loginResult;
  },

  async register({ name, email, password }) {
    const res = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password }),
    });
    
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json;
  },
};

export default API;
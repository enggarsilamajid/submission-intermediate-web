import CONFIG from '../config';

const API = {
  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (json.error) throw new Error(json.message);

    return json;
  },

  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    if (json.error) throw new Error(json.message);

    return json;
  },

  async addStory(formData) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await response.json();
    if (json.error) throw new Error(json.message);

    return json;
  },
};

export default API;
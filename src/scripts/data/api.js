import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

const API = {
  async getStories() {
    try {
      const response = await fetch(ENDPOINTS.STORIES);
      const responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error('GET ERROR:', error);
      throw error;
    }
  },

  async addStory(formData) {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(ENDPOINTS.STORIES, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Gagal kirim data');
      }

      return responseJson;
    } catch (error) {
      console.error('POST ERROR:', error);
      throw error;
    }
  },
};

export default API;
import API from '../data/api';

export default class LoginPresenter {
  constructor({ view }) {
    this._view = view;
  }

  init() {
    const form = document.querySelector('#login-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        window.showLoading();

        const response = await API.login({ email, password });

        localStorage.setItem('token', response.loginResult.token);

        this._view.showSuccess('Login berhasil');

        window.location.hash = '#/';

      } catch (error) {
        this._view.showError(error.message);
      } finally {
        window.hideLoading();
      }
    });
  }
}
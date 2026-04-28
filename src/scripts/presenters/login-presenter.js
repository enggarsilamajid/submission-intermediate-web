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
        window.showLoading?.();

        const response = await API.login({ email, password });

        window.hideLoading?.();

        if (response.error) {
          this._view.showError(response.message);
          return;
        }

        localStorage.setItem('token', response.loginResult.token);

        this._view.showSuccess('Login berhasil!');

        window.location.hash = '#/';

      } catch (error) {
        window.hideLoading?.();
        this._view.showError(error.message);
      }
    });
  }
}
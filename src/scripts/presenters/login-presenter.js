import API from '../data/api';

export default class LoginPresenter {
  constructor({ view }) {
    this._view = view;
  }

  init() {
    document.querySelector('#login-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        try {
          alert(JSON.stringify(result));
          const result = await API.login({ email, password });

          if (result.error) {
            this._view.showError(result.message);
            return;
          }

          localStorage.setItem('token', result.loginResult.token);
          localStorage.setItem('name', result.loginResult.name);

          this._view.showSuccess('Login berhasil');

          window.location.hash = '/';
          alert(localStorage.getItem('token'));

        } catch (err) {
          this._view.showError(err.message);
        }
      });
  }
}
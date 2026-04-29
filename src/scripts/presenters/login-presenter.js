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
          const result = await API.login({ email, password });

          alert('LOGIN RESPONSE: ' + JSON.stringify(result));

          if (result.error) {
            alert('Login gagal: ' + result.message);
            return;
          }

          const token = result.loginResult.token;

          localStorage.setItem('token', token);

          alert('Login berhasil');

          //_____
          alert('TOKEN TERSIMPAN: ' + localStorage.getItem('token'));

          window.location.hash = '/';

        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
  }
}
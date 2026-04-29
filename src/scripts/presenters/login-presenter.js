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

// ❌ HAPUS DEBUG
// alert('LOGIN RESPONSE: ' + JSON.stringify(result));

if (result.error) {

  const message = result.message.toLowerCase();

  // 🔥 HANDLE SEMUA ERROR LOGIN
  if (
    message.includes('not found') ||
    message.includes('user') ||
    message.includes('email')
  ) {
    alert('Silakan register dulu');
    window.location.hash = '/register';
  } else {
    alert('Email atau password salah');
  }

  return;
}

          const token = result.loginResult.token;

          localStorage.setItem('token', token);

          alert('Login berhasil');

          alert('TOKEN TERSIMPAN: ' + localStorage.getItem('token'));

          window.location.hash = '/';

        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
  }
}
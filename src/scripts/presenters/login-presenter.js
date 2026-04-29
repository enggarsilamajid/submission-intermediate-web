import API from '../data/api';

export default class LoginPresenter {
  constructor({ view }) {
    this._view = view;
  }

  init() {
    document.querySelector('#login-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value.trim();

        // 🔍 DEBUG (HP FRIENDLY)
        alert('EMAIL: ' + email);
        alert('PASSWORD: ' + password);

        try {
          const result = await API.login({ email, password });

          // 🔍 DEBUG RESPONSE
          alert('RESPONSE: ' + JSON.stringify(result));

          if (result.error) {
            const message = result.message.toLowerCase();

            if (message.includes('not found')) {
              alert('Akun belum terdaftar, silakan register dulu');
              window.location.hash = '/register';
            } 
            else if (
              message.includes('password') ||
              message.includes('unauthorized')
            ) {
              alert('Email atau password salah');
            } 
            else if (message.includes('valid email')) {
              alert('Format email tidak valid');
            } 
            else {
              alert('Login gagal: ' + result.message);
            }

            return;
          }

          // ✅ LOGIN BERHASIL
          const token = result.loginResult?.token;

          if (!token) {
            alert('Token tidak ditemukan');
            return;
          }

          localStorage.setItem('token', token);

          alert('Login berhasil');

          window.location.hash = '/';

        } catch (err) {
          alert('Terjadi kesalahan: ' + err.message);
        }
      });
  }
}
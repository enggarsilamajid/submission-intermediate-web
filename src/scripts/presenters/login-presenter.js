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

        try {
          const result = await API.login({ email, password });

          if (result.error) {
            const message = result.message.toLowerCase();

            if (message.includes('not found')) {
              this._view.showError('Akun belum terdaftar, silakan register');

              setTimeout(() => {
                window.location.hash = '/register';
              }, 1500);
            } 
            else if (
              message.includes('password') ||
              message.includes('unauthorized')
            ) {
              this._view.showError('Email atau password salah');
            } 
            else if (message.includes('valid email')) {
              this._view.showError('Format email tidak valid');
            } 
            else {
              this._view.showError(result.message);
            }

            return;
          }

          // ✅ LOGIN BERHASIL
          const token = result.loginResult?.token;

          if (!token) {
            this._view.showError('Token tidak ditemukan');
            return;
          }

          localStorage.setItem('token', token);

          this._view.showSuccess('Login berhasil');

          setTimeout(() => {
            window.location.hash = '/';
          }, 1000);

        } catch (err) {
          this._view.showError('Terjadi kesalahan: ' + err.message);
        }
      });
  }
}
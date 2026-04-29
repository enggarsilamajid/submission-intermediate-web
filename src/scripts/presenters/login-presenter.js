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

          // 🔍 HANDLE ERROR DARI API
          if (result.error) {
            const message = result.message.toLowerCase();

            // ❌ USER BELUM TERDAFTAR
            if (message.includes('not found')) {
              alert('Akun belum terdaftar, silakan register dulu');
              window.location.hash = '/register';
            } 
            // ❌ PASSWORD SALAH / UNAUTHORIZED
            else if (
              message.includes('password') ||
              message.includes('unauthorized')
            ) {
              alert('Email atau password salah');
            } 
            // ❌ FORMAT EMAIL SALAH
            else if (message.includes('valid email')) {
              alert('Format email tidak valid');
            } 
            // ❌ ERROR LAIN
            else {
              alert('Login gagal: ' + result.message);
            }

            return; // 🔥 WAJIB STOP
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

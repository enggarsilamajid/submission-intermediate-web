import API from '../../data/api';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-page">
        <h1>Login</h1>

        <form id="login-form">
          <label>Email</label>
          <input type="email" id="email" required />

          <label>Password</label>
          <input type="password" id="password" required />

          <button type="submit">Login</button>
        </form>

        <p>Belum punya akun? <a href="#/register">Register</a></p>
      </section>
    `;
  }

  async afterRender() {
    document.querySelector('#login-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        try {
          const result = await API.login({ email, password });

          localStorage.setItem('token', result.token);

          alert('Login berhasil');

          window.location.hash = '/';
        } catch (err) {
          alert(err.message);
        }
      });
  }
}
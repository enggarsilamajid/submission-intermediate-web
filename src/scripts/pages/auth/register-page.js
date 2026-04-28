import API from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-form">
        <h1>Register</h1>

        <form id="register-form">
          <label>Nama</label>
          <input type="text" id="name" required />

          <label>Email</label>
          <input type="email" id="email" required />

          <label>Password</label>
          <input type="password" id="password" required />

          <button type="submit">Register</button>
        </form>

        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </section>
    `;
  }

  async afterRender() {
    document.querySelector('#register-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        try {
          await API.register({ name, email, password });

          alert('Register berhasil, silakan login');

          window.location.hash = '/login';
        } catch (err) {
          alert(err.message);
        }
      });
  }
}
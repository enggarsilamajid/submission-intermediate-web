import RegisterPresenter from '../../presenters/register-presenter';

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
          <div class="password-wrapper">
            <input type="password" id="password" required />
            <button type="button" id="toggle-password">👁</button>
          </div>

          <button type="submit">Register</button>
        </form>

        <p id="status"></p>

        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new RegisterPresenter({ view: this });
    presenter.init();

    const toggle = document.querySelector('#toggle-password');
    const password = document.querySelector('#password');

    toggle.addEventListener('click', () => {
      password.type = password.type === 'password' ? 'text' : 'password';
    });
  }

  showSuccess(message) {
    document.querySelector('#status').innerHTML = `
      <p style="color:green;">${message}</p>
    `;
  }

  showError(message) {
    document.querySelector('#status').innerHTML = `
      <p style="color:red;">${message}</p>
    `;
  }
}
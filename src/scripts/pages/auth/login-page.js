import LoginPresenter from '../../presenters/login-presenter';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-form">
        <h1>Login</h1>

        <p id="auth-message" style="text-align:center; margin-bottom:10px;"></p>

        <form id="login-form">
          <label>Email</label>
          <input type="email" id="email" required />

          <label>Password</label>
          <div class="password-wrapper">
            <input type="password" id="password" required />
            <button type="button" id="toggle-password">👁</button>
          </div>

          <button type="submit">Login</button>
        </form>

        <p>Belum punya akun? <a href="#/register">Register</a></p>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new LoginPresenter({ view: this });
    presenter.init();

    const passwordInput = document.querySelector('#password');
    const toggleBtn = document.querySelector('#toggle-password');

    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.textContent = isPassword ? '🙈' : '👁';
    });
  }

  showSuccess(message) {
    const el = document.querySelector('#auth-message');
    el.textContent = message;
    el.style.color = 'green';
  }

  showError(message) {
    const el = document.querySelector('#auth-message');
    el.textContent = message;
    el.style.color = 'red';
  }
}
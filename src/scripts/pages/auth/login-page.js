import LoginPresenter from '../../presenters/login-presenter';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-form">
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
    const presenter = new LoginPresenter({ view: this });
    presenter.init();
  }
}
import LoginPresenter from '../../presenters/login-presenter';

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>

        <form id="login-form">
          <label>Email</label><br/>
          <input id="email" type="email" required /><br/><br/>

          <label>Password</label><br/>
          <input id="password" type="password" required /><br/><br/>

          <button id="submit-btn" type="submit">Login</button>

          <p id="status"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._presenter = new LoginPresenter({ view: this });
    this._presenter.init();
  }

  showSuccess(message) {
    document.querySelector('#status').innerText = message;
  }

  showError(message) {
    document.querySelector('#status').innerText = `Error: ${message}`;
  }
}
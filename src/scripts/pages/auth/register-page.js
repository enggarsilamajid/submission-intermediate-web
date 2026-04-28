import RegisterPresenter from '../../presenters/register-presenter';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>

        <form id="register-form">
          <label>Nama</label><br/>
          <input id="name" type="text" required /><br/><br/>

          <label>Email</label><br/>
          <input id="email" type="email" required /><br/><br/>

          <label>Password</label><br/>
          <input id="password" type="password" required /><br/><br/>

          <button id="submit-btn" type="submit">Register</button>

          <p id="status"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._presenter = new RegisterPresenter({ view: this });
    this._presenter.init();
  }

  showSuccess(message) {
    document.querySelector('#status').innerText = message;
  }

  showError(message) {
    document.querySelector('#status').innerText = `Error: ${message}`;
  }
}
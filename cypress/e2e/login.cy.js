/**
 * skenario pengujian
 *
 * - Login spec
 *   - should display the login page with both fields and the submit button
 *   - should stay on the login page and send no request when the email is empty
 *   - should stay on the login page and send no request when the password is empty
 *   - should show the failure message of the API in an alert when the credentials are wrong
 *   - should open the home page with the thread list and the user's navigation when the credentials are correct
 *   - should show the guest navigation again after the user logs out
 */

const email = 'tester@example.test';
const password = 'rahasia';

describe('Login spec', () => {
  beforeEach(() => {
    // arrange: a request to the Forum API that is not stubbed below fails loudly
    cy.intercept('**/forum-api.dicoding.dev/**', {
      statusCode: 500,
      body: { status: 'fail', message: 'unstubbed' },
    });
    cy.intercept({ method: 'POST', url: '**/v1/login' }, {
      statusCode: 200,
      fixture: 'login-success.json',
    }).as('login');
    cy.intercept({ method: 'GET', url: '**/v1/users/me' }, {
      statusCode: 200,
      fixture: 'own-profile.json',
    }).as('profile');
    cy.intercept({ method: 'GET', url: '**/v1/users' }, {
      statusCode: 200,
      fixture: 'users.json',
    }).as('users');
    cy.intercept({ method: 'GET', url: '**/v1/threads' }, {
      statusCode: 200,
      fixture: 'threads.json',
    }).as('threads');
    cy.visit('/login');
  });

  it('should display the login page with both fields and the submit button', () => {
    // assert
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('be.visible');
    cy.get('#login-submit').should('be.visible').and('contain.text', 'Masuk');
  });

  it('should stay on the login page and send no request when the email is empty', () => {
    // action: only the password is typed, so the browser blocks the submit
    cy.get('#login-password').type(password);
    cy.get('#login-submit').click();

    // assert
    cy.get('#login-email:invalid').should('exist');
    cy.location('pathname').should('eq', '/login');
    cy.get('@login.all').should('have.length', 0);
  });

  it('should stay on the login page and send no request when the password is empty', () => {
    // action: only the email is typed, so the browser blocks the submit
    cy.get('#login-email').type(email);
    cy.get('#login-submit').click();

    // assert
    cy.get('#login-password:invalid').should('exist');
    cy.location('pathname').should('eq', '/login');
    cy.get('@login.all').should('have.length', 0);
  });

  it('should show the failure message of the API in an alert when the credentials are wrong', () => {
    // arrange: the login request is answered with the failure fixture
    cy.intercept({ method: 'POST', url: '**/v1/login' }, {
      statusCode: 401,
      fixture: 'login-fail.json',
    }).as('loginFail');
    const onAlert = cy.stub();
    cy.on('window:alert', onAlert);

    // action
    cy.get('#login-email').type(email);
    cy.get('#login-password').type('salah');
    cy.get('#login-submit').click();

    // assert
    cy.wait('@loginFail');
    cy.wrap(onAlert).should('have.been.calledOnceWithExactly', 'email or password is wrong');
    cy.location('pathname').should('eq', '/login');
  });

  it('should open the home page with the thread list and the user\'s navigation when the credentials are correct', () => {
    // action
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.get('#login-submit').click();

    // assert: the login request carried exactly what was typed, once
    cy.wait('@login').its('request.body').should('deep.equal', { email, password });
    cy.get('@login.all').should('have.length', 1);
    cy.wait('@profile').its('request.headers.authorization').should('eq', 'Bearer token-1');

    // assert: the home page shows the threads of the fixture and the user's navigation
    cy.location('pathname').should('eq', '/');
    cy.contains('h2', 'Cara menulis pengujian reducer').should('be.visible');
    cy.contains('h2', 'Kapan memakai test double').should('be.visible');
    cy.get('.app-nav__user').should('have.text', 'Penguji Satu');
    cy.get('#logout-button').should('be.visible').and('contain.text', 'Keluar');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.eq('token-1');
    });
  });

  it('should show the guest navigation again after the user logs out', () => {
    // arrange: log in first
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.get('#login-submit').click();
    cy.get('#logout-button').should('be.visible');

    // action
    cy.get('#logout-button').click();

    // assert
    cy.get('#logout-button').should('not.exist');
    cy.get('.app-nav').contains('a', 'Masuk').should('be.visible');
    cy.get('.app-nav').contains('a', 'Daftar').should('be.visible');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.eq('');
    });
  });
});

const LOGIN_URL = 'http://localhost:3000/login';

context('App', () => {
  it('should load page and display auth buttons', () => {
    cy.visit(LOGIN_URL);
    cy.contains('Log in with Google');
    cy.contains('Log out');
  });

  it('should show log out button as disabled while not logged in', () => {
    cy.visit(LOGIN_URL);
    cy.contains('Log out').should('be.disabled');
    cy.url().should('equal', LOGIN_URL);
  });
});

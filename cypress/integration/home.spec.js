context('The home page', () => {
  it('should load our app and show context', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Lineage');
  });
});

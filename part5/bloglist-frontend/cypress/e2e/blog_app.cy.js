describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('blogs')
    cy.contains('login').click()
    cy.get('#username')
    cy.get('#password')
    cy.contains('cancel')
  })
})

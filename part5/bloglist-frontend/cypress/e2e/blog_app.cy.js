describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('blogs')
    cy.contains('login').click()
    cy.get('#username')
    cy.get('#password')
    cy.contains('cancel')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('I love my pants')
      cy.get('#author').type('Mr Fancy Pants')
      cy.get('#url').type('www.mybloghere.com')

      cy.contains('save').click()
      cy.get('.info')
        .should('contain','a new blog I love my pants added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('.blog')
        .should('contain','I love my pants')
      cy.contains('view')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'I love my pants',
          author: 'Mr Fancy Pants',
          url: 'www.mybloghere.com'
        })
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()

        cy.get('.likes')
          .should('contain','likes 0')
        cy.get('#likeButton').click()

        cy.get('.likes')
          .should('contain','likes 1')
      })

      it('A blog can be deleted by its owner', function() {
        cy.contains('view').click()

        cy.get('.togglableContent')
          .should('contain','remove')

        cy.contains('remove').as('btn')
        cy.get('@btn').click()

        cy.get('html').should('not.contain', 'I love my pants')
      })

      it('A blog can NOT be deleted by someone else than the owner', function() {
        cy.logout()
        cy.createUser({
          name: 'Another user',
          username: 'anuser',
          password: 'salainen'
        })
        cy.login({ username: 'anuser', password: 'salainen' })

        cy.contains('view').as('btn')
        cy.get('@btn').click()

        cy.get('.togglableContent')
          .should('not.contain','remove')
      })
    })
  })
})

describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
    })

    describe('Login form/Toggleable component test', function () {
        beforeEach(function () {
            cy.visit('http://localhost:3000')
        })

        it('Login form is not shown at start', function () {
            cy.get('HTML').should('not.contain','Log in to application')
        })

        it('Login form is shown after clicking login button', function () {
            cy.contains('Login').click()
            cy.contains('Log in to application')
        })

        it('Login form is not shown after clicking login button, and cancel button', function () {
            cy.contains('Login').click()
            cy.contains('Log in to application')
            cy.contains('Cancel').click()
            cy.get('HTML').should('not.contain','Log in to application')
        })
    })

    describe('Login test', function () {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3003/api/testing/reset')
            const user = {
                username: 'gmarton',
                name: 'Greczi Marton',
                password: 'Asd.123'
            }
            cy.request('POST','http://localhost:3003/api/users',user)
            cy.visit('http://localhost:3000')
            cy.contains('Login').click()
        })

        it('Login with wrong username', function () {
            cy.get('#loginform-username').type('wrongusername')
            cy.get('#loginfrom-password').type('Asd.123')
            cy.get('#loginform-submit').click()
            cy.contains('Wrong credentials').should('have.css','color','rgb(255, 0, 0)')
        })

        it('Login with wrong password', function () {
            cy.get('#loginform-username').type('gmarton')
            cy.get('#loginfrom-password').type('wrongpassword')
            cy.get('#loginform-submit').click()
            cy.contains('Wrong credentials').should('have.css','color','rgb(255, 0, 0)')
        })

        it('Login with right credentials', function () {
            cy.get('#loginform-username').type('gmarton')
            cy.get('#loginfrom-password').type('Asd.123')
            cy.get('#loginform-submit').click()
            cy.contains('Successful login. Welcome back Greczi Marton').should('have.css','color','rgb(0, 128, 0)')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.setDefaultDBState()
            cy.login({ username: 'gmarton', password: 'Asd.123' })
        })

        it('Create blog test', function () {
            cy.contains('Create blog').click()
            cy.get('#create-blog-from-title').type('test blog title')
            cy.get('#create-blog-from-author').type('test blog author')
            cy.get('#create-blog-from-url').type('www.testblogurl.com')
            cy.get('#create-blog-from-submit').click()

            cy.contains('test blog title')
            cy.contains('test blog author')
            cy.contains('A new blog test blog title by test blog author added.')
                .should('have.css','color','rgb(0, 128, 0)')
        })

        describe('One blog created by user', function () {
            beforeEach(function () {
                cy.createBlog({ title: 'testBlogTitle', author: 'testBlogAuthor', url: 'www.testblogurl.com' })
            })

            it ('View blog', function () {
                cy.contains('testBlogTitle').parent()
                    .contains('View').click()

            })

            it('Like blog', function () {
                cy.contains('testBlogTitle').parent()
                    .contains('View').click()
                cy.get('HTML').should('contain','Likes: 0')
                cy.contains('Like').click()
                cy.get('HTML').should('not.contain','Likes: 0')
                cy.get('HTML').should('contain','Likes: 1')
            })

            it('Remove blog', function () {
                cy.contains('View').click()
                cy.contains('Remove').click()
                cy.contains('The blog, \'testBlogTitle\' by testBlogAuthor has been removed.')
                    .should('have.css','color','rgb(0, 128, 0)')
            })

            it('Blog can\'t be removed by other user', function () {
                cy.contains('Logout').click()
                cy.login({ username: 'antagonist', password: 'Asd.124' })
                cy.contains('View').click()
                cy.contains('Remove').click()
                cy.contains('Unauthorized delete')
                    .should('have.css','color','rgb(255, 0, 0)')
            })
        })

        describe('More blogs are created, and liked by user. Test order', function () {
            beforeEach(function () {
                cy.createBlog({ title: 'testBlogTitle', author: 'testBlogAuthor', url: 'www.testblogurl.com' })
                cy.createBlog({ title: 'testBlogTitle1', author: 'testBlogAuthor1', url: 'www.testblogurl1.com' })
                cy.createBlog({ title: 'testBlogTitle2', author: 'testBlogAuthor2', url: 'www.testblogurl2.com' })

                cy.contains('testBlogTitle').parent().contains('View').click()
                cy.contains('testBlogTitle').parent().contains('Like').click()
                cy.contains('Likes: 1')
                cy.contains('testBlogTitle').parent().contains('Like').click()
                cy.contains('Likes: 2')
                cy.contains('testBlogTitle').parent().contains('Like').click()
                cy.contains('Likes: 3')

                cy.contains('testBlogTitle1').parent().contains('View').click()
                cy.contains('testBlogTitle1').parent().contains('Like').click()
                cy.contains('Likes: 1')
                cy.contains('testBlogTitle1').parent().contains('Like').click()
                cy.contains('Likes: 2')

                cy.contains('testBlogTitle2').parent().contains('View').click()
                cy.contains('testBlogTitle2').parent().contains('Like').click()
                cy.contains('Likes: 1')
            })

            it('Checks if blogs are in order according to likes', function () {
                cy.get('[data-cy=blogComponent]').then(blogs => {
                    const childNodes = blogs.map((index,blog) => blog.childNodes[7].textContent).toArray()
                    function isDescending(childNodes) {
                        return childNodes.every(function (x, i) {
                            return i === 0 || x <= childNodes[i - 1]
                        })
                    }

                    expect(isDescending(childNodes)).to.be.true
                })
            })


        })
    })



})
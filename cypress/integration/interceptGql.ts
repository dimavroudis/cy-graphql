describe('cy.interceptGql', () => {
    it('intercept request with operationName', () => {
        cy.interceptGql("HelloWorld");
        cy.visit('');
        cy.wait('@HelloWorld').then(intercept => {
            expect(intercept.response.body).to.deep.equal({
                data: {
                    hello: 'Hello world!'
                }
            });
        })
    });

    it('intercept multiple requests', () => {
        cy.interceptGql(['HelloWorld', 'GetTodos']);
        cy.visit('');
        cy.wait(['@HelloWorld', '@GetTodos']).then(intercept => {
            expect(intercept[0].request.body).to.have.property('operationName', 'HelloWorld');
            expect(intercept[1].request.body).to.have.property('operationName', 'GetTodos');
        })
    });

    it('intercept multiple requests with variable propertyPath', () => {
        cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden' }], 'GetAllTodos');
        cy.visit('');
        cy.wait('@GetAllTodos').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'GetTodos');
            expect(intercept.request.body).to.have.nested.property('variables.showHidden');
        })
    });

    it('intercept multiple requests with variable propertyPath and value', () => {
        cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden', value: false }], 'GetPublicTodos');
        cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden', value: true }], 'GetAllTodos');

        cy.visit('');
        cy.wait(['@GetPublicTodos', '@GetAllTodos']).then(intercept => {
            expect(intercept[0].request.body).to.have.property('operationName', 'GetTodos');
            expect(intercept[0].request.body).to.have.nested.property('variables.showHidden', false);

            expect(intercept[1].request.body).to.have.property('operationName', 'GetTodos');
            expect(intercept[1].request.body).to.have.nested.property('variables.showHidden', true);
        })
    });
});
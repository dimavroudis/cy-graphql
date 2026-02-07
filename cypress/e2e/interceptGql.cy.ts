describe('cy.interceptGql', () => {
    it('intercept request with operationName', () => {
        cy.interceptGql('HelloWorld');
        cy.visit('');
        cy.wait('@HelloWorld').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'HelloWorld');
        });
    });

    it('intercept request that has variables', () => {
        cy.interceptGql('GetTodos');
        cy.visit('');
        cy.wait('@GetTodos').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'GetTodos');
        });
    });

    it('intercept request with operationName and callback', () => {
        cy.interceptGql('HelloWorld', req => {
            req.alias = '101';
        });
        cy.visit('');
        cy.wait('@101').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'HelloWorld');
        });
    });

    it('intercept multiple requests', () => {
        cy.interceptGql(['HelloWorld', 'GetTodos']);
        cy.visit('');
        cy.wait(['@HelloWorld', '@GetTodos']).then(intercept => {
            expect(intercept[0].request.body).to.have.property('operationName', 'HelloWorld');
            expect(intercept[1].request.body).to.have.property('operationName', 'GetTodos');
        });
    });

    it('intercept multiple requests with variable propertyPath', () => {
        cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden' }], 'GetAllTodos');
        cy.visit('');
        cy.wait('@GetAllTodos').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'GetTodos');
            expect(intercept.request.body).to.have.nested.property('variables.showHidden');
        });
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
        });
    });

    it('intercept multiple requests with variable and callback', () => {
        cy.interceptGql('GetTodos', [{ propertyPath: 'showHidden' }], req => {
            req.alias = '102';
        });
        cy.visit('');
        cy.wait('@102').then(intercept => {
            expect(intercept.request.body).to.have.property('operationName', 'GetTodos');
            expect(intercept.request.body).to.have.nested.property('variables.showHidden');
        });
    });
});

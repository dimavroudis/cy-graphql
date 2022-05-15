describe('cy.interceptGql', () => {
    it('intercept request with operationName', () => {
        cy.interceptGql("HelloWorld");
        cy.visit('');
        cy.wait('@gqlHelloWorld').then(intercept => {
            expect(intercept.response.body).to.deep.equal({
                data: {
                    hello: 'Hello world!'
                }
            });
        })
    });
});
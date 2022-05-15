// loads definition for the custom "cy.gql" command
/// <reference path="../../dist/types.d.ts" />

describe('cy.gql', () => {
    it('calls gql method', () => {
        cy.gql(
            `query HelloWorld{
                hello
            }`
        );
    })


    it('calls several times', () => {
        const payload =
            `query HelloWorld{
                hello
            }`;
            
        cy.gql(payload)
        cy.gql(payload)
        cy.gql(payload)
    })

    it('yields API call result', () => {
        cy.gql(
            `query HelloWorld{
                hello
            }`,
        ).then(response => {
            expect(response).to.include.keys([
                'status',
                'statusText',
                'body',
                'requestHeaders',
                'headers',
                'duration'
            ])
            expect(response.body).to.deep.equal({
                data: {
                    hello: 'Hello world!'
                }
            });
        });
    })

})
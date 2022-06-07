// loads definition for the custom "cy.gql" command
/// <reference path="../../dist/types.d.ts" />

describe('cy.gql', () => {
    it('calls gql command', () => {
        cy.gql(
            `query HelloWorld{
                hello
            }`
        );
    })


    it('calls gql several times', () => {
        const payload =
            `query HelloWorld{
                hello
            }`;

        cy.gql(payload)
        cy.gql(payload)
        cy.gql(payload)
    })

    it('yields graphql query result', () => {
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

    it('calls gql command with variables', () => {
        cy.gql(
            `query todo($id:Int!){
                todo(id:$id){
                    id
                }
            }`,
            {
                variables: { id: 1 },
            }
        ).then(response => {
            expect(response.body).to.deep.equal({
                data: {
                    todo: {
                        id: 1
                    }
                }
            });
        });
    })

    it('calls gql command with cy.request options', () => {
        cy.gql(
            `query HelloWorld{
                hello
            }`,
            {
                headers: { 'Authorization': "Bearer bearerToken" }
            }
        ).then(response => {
            expect(response.body).to.deep.equal({
                data: {
                    hello: 'Hello you!'
                }
            });
        });
    })
})
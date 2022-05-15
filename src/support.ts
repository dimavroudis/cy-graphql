/// <reference types="cypress" />

const { get, has } = Cypress._;

Cypress.Commands.add('gql', (query: string, variables: Object = {}, options: Partial<Cypress.RequestOptions> = {}) => {

    const url = get(Cypress.env(), 'graphqlUrl', null);
    const body = { query, variables };
    const headers = {
        ...(get(options, 'headers') || {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (!url) {
        throw new Error('Graphql URL endpoint is not defined.');
    }
    options = {
        ...options,
        headers,
        body,
        url,
        log: false
    };

    // log the message before requests in case it fails
    Cypress.log({
        message: options.url,
        consoleProps() {
            return {
                request: options
            }
        }
    });

    cy.request(options).then((response) => {
        // log the response
        Cypress.log({
            name: 'response',
            message: options.url,
            consoleProps() {
                return {
                    type: typeof response.body,
                    response: response.body
                }
            }
        });

        return response;
    });

})

Cypress.Commands.add('interceptGql', (operationName: string) => {
    const url = get(Cypress.env(), 'graphqlUrl', null);
    if (!url) {
        throw new Error('Graphql URL endpoint is not defined.');
    }

    const hasOperationName = (req: any, operationName: string) => {
        const { body } = req;
        return (
            body.hasOwnProperty('operationName') && body.operationName === operationName
        );
    };

    cy.intercept('POST', url, (req) => {
        if (hasOperationName(req, operationName)) {
            req.alias = `gql${operationName}`;
        }
    });
})
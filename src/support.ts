/// <reference types="cypress" />

const { get, has } = Cypress._;

Cypress.Commands.add('gql', (query: string, variables: Object = {}, options: Partial<Cypress.RequestOptions> = {}) => {
    //Use options.url if exists and use GQL_URL as fallback
    const url = get(options, 'url', get(Cypress.env(), 'GQL_URL', null));
    const body = { query, variables };
    const headers = {
        ...(get(options, 'headers') || {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (!url) {
        throw new Error('Environment variable GQL_URL is not defined.');
    }
    options = {
        ...options,
        headers,
        body,
        url,
    };

    const message = get(options.body, 'query', options.url);

    // log the message before requests in case it fails
    Cypress.log({
        message,
        consoleProps() {
            return {
                request: options
            }
        }
    });

    cy.request({ ...options, log: false }).then((response) => {
        // log the response
        Cypress.log({
            name: 'response',
            message,
            consoleProps() {
                return {
                    response: response.body
                }
            }
        });

        return response;
    });

})

Cypress.Commands.add('interceptGql', (operationName: string) => {
    const url = get(Cypress.env(), 'GQL_URL', null);
    if (!url) {
        throw new Error('Environment variable GQL_URL is not defined.');
    }

    const hasOperationName = (req: any, operationName: string) => {
        const { body } = req;
        return (
            has(body, 'operationName') && body.operationName === operationName
        );
    };

    cy.intercept('POST', url, (req) => {
        if (hasOperationName(req, operationName)) {
            req.alias = operationName;
        }
    });
});
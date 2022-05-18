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

Cypress.Commands.add('interceptGql', function (...args: [operationName: string, callback?: GqlRequestInterceptor] | [operationName: string, variablesRules?: VariableRule[], alias?: string] | [operationName: string, variablesRules?: VariableRule[], callback?: GqlRequestInterceptor] | [operationName: string[]]) {

    const url = get(Cypress.env(), 'GQL_URL', null);
    if (!url) {
        throw new Error('Environment variable GQL_URL is not defined.');
    }

    let callback: GqlRequestInterceptor | null,
        variableRules: VariableRule[] = [],
        alias: string | null;

    // interceptGql with only callback function
    if (args[1] && typeof args[1] === 'function') {
        callback = args[1];
    }

    // interceptGql with variable Rules
    if (args[1] && Array.isArray(args[1])) {
        variableRules = args[1];
        if (args[2] && typeof args[2] === 'function') {
            callback = args[2];
        }
        if (args[2] && typeof args[2] === 'string') {
            alias = args[2];
        }
    }

    const matchesOperationName = (req: any, name: string) => has(req.body, 'operationName') && req.body.operationName === name;

    const matchesVariables = (req: any) => {
        const variables = get(req.body, 'variables', null)
        if (!variableRules || !variables) {
            return true;
        }
        for (let rule of variableRules) {
            if (has(variables, rule.propertyPath) && (!has(rule, 'value') || get(variables, rule.propertyPath) === rule.value)) {
                return true;
            }
        }
        return false;
    };

    //Single operationName
    if (typeof args[0] === 'string') {
        let operationName = args[0];
        cy.intercept('POST', url, (req) => {
            if (matchesOperationName(req, operationName) && matchesVariables(req)) {
                req.alias = alias ?? operationName;
                if (typeof callback === 'function') {
                    callback(req);
                }
            }
        });
    }

    //Multiple operationNames
    if (Array.isArray(args[0])) {
        let operationNames = [...args[0]];
        cy.intercept('POST', url, (req) => {
            for (const name of operationNames) {
                if (matchesOperationName(req, name)) {
                    req.alias = name;
                }
            }
        });
    }
});
/// <reference types="cypress" />

const { get, has, isEmpty } = Cypress._;

Cypress.Commands.add('gql', (query: string, options: Partial<GraphQLOptions> = {}) => {
    let _options = { ...options };
    //Use options.url if exists and use gqlUrl config as fallback
    const url = get(_options, 'url', get(Cypress.env(), 'gqlUrl', null));
    const body = { query, variables: {} };

    if (_options.variables) {
        body.variables = _options.variables;
        delete _options.variables;
    }

    const headers = {
        ...(get(options, 'headers') || {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (!url) {
        throw new Error('A GraphQL endpoint url is not defined. Set global configuration `gqlUrl` in `cypress.json` or add the `url` option.');
    }

    const requestOptions = {
        ..._options,
        headers,
        body,
        url,
    };

    const message = get(requestOptions.body, 'query', requestOptions.url);

    // log the message before requests in case it fails
    Cypress.log({
        message,
        consoleProps() {
            return {
                request: requestOptions
            }
        }
    });

    cy.request({ ...requestOptions, log: false }).then((response) => {
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

    const url = get(Cypress.env(), 'gqlUrl', null);
    if (!url) {
        throw new Error('Global configuration `gqlUrl` is not initialized.');
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
        if (isEmpty(variableRules)) {
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